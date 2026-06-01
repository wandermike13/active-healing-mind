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

    // Get all sessions
    const sessions = await base44.entities.Session.filter({ user_id });
    const completedSessions = sessions.filter((s: any) => s.completed).length;

    // Upgrade nudge: every 3 sessions for free users, but not at session 0
    const showUpgradeNudge = !user.is_premium && completedSessions > 0 && completedSessions % 3 === 0;

    // Next session number
    const nextSessionNumber = completedSessions + 1;

    // Days since first session
    const sortedSessions = sessions
      .filter((s: any) => s.session_date)
      .sort((a: any, b: any) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());

    let daysSinceStart = 0;
    if (sortedSessions.length > 0) {
      const first = new Date(sortedSessions[0].session_date);
      const now = new Date();
      daysSinceStart = Math.floor((now.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
    }

    return Response.json({
      success: true,
      profile: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        is_premium: user.is_premium || false,
        completed_sessions: completedSessions,
        next_session_number: nextSessionNumber,
        days_since_start: daysSinceStart,
        show_upgrade_nudge: showUpgradeNudge
      }
    });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});
