import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { user_id } = await req.json();

    if (!user_id) {
      return Response.json({ error: "user_id is required" }, { status: 400 });
    }

    // Get user record
    const users = await base44.entities.User.filter({ id: user_id });

    if (!users || users.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    // Count their completed sessions
    const sessions = await base44.entities.Session.filter({ user_id });
    const completedSessions = sessions.filter((s: any) => s.completed).length;

    // Show upgrade nudge every 3 sessions for free users
    const showUpgradeNudge = !user.is_premium && completedSessions > 0 && completedSessions % 3 === 0;

    return Response.json({
      success: true,
      profile: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        is_premium: user.is_premium || false,
        completed_sessions: completedSessions,
        show_upgrade_nudge: showUpgradeNudge
      }
    });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});
