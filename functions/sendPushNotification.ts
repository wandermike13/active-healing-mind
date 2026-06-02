import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const {
      user_id,
      title,
      body,
      data
    } = await req.json();

    if (!user_id || !title || !body) {
      return Response.json(
        { error: "Missing required fields: user_id, title, body" },
        { status: 400 }
      );
    }

    // Get user record to verify they exist and fetch push token
    let user;
    try {
      user = await base44.entities.User.get(user_id);
    } catch (e) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has a push token registered
    const pushToken = user.push_token;

    if (!pushToken) {
      // No push token — user hasn't granted notification permission yet
      return Response.json({
        success: false,
        reason: "no_push_token",
        message: "User has not registered a push token. Notification not sent."
      });
    }

    // Validate Expo push token format
    const isValidToken =
      pushToken.startsWith("ExponentPushToken[") ||
      pushToken.startsWith("ExpoPushToken[");

    if (!isValidToken) {
      return Response.json(
        { error: "Invalid push token format" },
        { status: 400 }
      );
    }

    // Send via Expo Push API
    const expoResponse = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: pushToken,
        title,
        body,
        data: data || {},
        sound: "default",
        priority: "high"
      })
    });

    const expoResult = await expoResponse.json();

    // Check for Expo-level errors
    if (expoResult?.data?.status === "error") {
      const details = expoResult.data.details || {};
      const errorCode = details.error || "UNKNOWN_ERROR";

      // If token is no longer valid, clear it from the user record
      if (errorCode === "DeviceNotRegistered") {
        await base44.entities.User.update(user_id, { push_token: null });
      }

      return Response.json({
        success: false,
        reason: errorCode,
        message: expoResult.data.message || "Push notification failed"
      });
    }

    return Response.json({
      success: true,
      message: "Push notification sent successfully",
      recipient: user.email,
      title,
      body,
      expo_response: expoResult
    });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});
