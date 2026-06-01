import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { user_id } = await req.json();

    if (!user_id) {
      return Response.json({ error: "user_id is required" }, { status: 400 });
    }

    // Fetch all sessions for this user
    const sessions = await base44.entities.Session.filter({ user_id });

    // Fetch all pain tracking entries for this user
    const painLogs = await base44.entities.PainTracking.filter({ user_id });

    // Sort by date ascending
    sessions.sort((a: any, b: any) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());
    painLogs.sort((a: any, b: any) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime());

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s: any) => s.completed).length;

    const avgPainBefore = sessions.length > 0
      ? sessions.reduce((sum: number, s: any) => sum + (s.pain_before || 0), 0) / sessions.length
      : 0;

    const avgPainAfter = sessions.length > 0
      ? sessions.reduce((sum: number, s: any) => sum + (s.pain_after || 0), 0) / sessions.length
      : 0;

    const avgImprovement = avgPainBefore - avgPainAfter;

    const latestPain = painLogs.length > 0 ? painLogs[painLogs.length - 1].pain_level : null;
    const baselinePain = painLogs.length > 0 ? painLogs[0].pain_level : null;
    const overallImprovement = baselinePain !== null && latestPain !== null ? baselinePain - latestPain : 0;

    return Response.json({
      success: true,
      summary: {
        totalSessions,
        completedSessions,
        avgPainBefore: Math.round(avgPainBefore * 10) / 10,
        avgPainAfter: Math.round(avgPainAfter * 10) / 10,
        avgImprovement: Math.round(avgImprovement * 10) / 10,
        baselinePain,
        latestPain,
        overallImprovement: Math.round(overallImprovement * 10) / 10
      },
      sessions,
      painLogs
    });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});
