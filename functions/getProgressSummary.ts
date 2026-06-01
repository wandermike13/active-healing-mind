import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { user_id } = await req.json();

    if (!user_id) {
      return Response.json({ error: "user_id is required" }, { status: 400 });
    }

    // Fetch all sessions and pain logs for this user
    const sessions = await base44.entities.Session.filter({ user_id });
    const painLogs = await base44.entities.PainTracking.filter({ user_id });

    // Sort ascending by date
    sessions.sort((a: any, b: any) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());
    painLogs.sort((a: any, b: any) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime());

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s: any) => s.completed).length;

    const avgPainBefore = totalSessions > 0
      ? sessions.reduce((sum: number, s: any) => sum + (s.pain_before || 0), 0) / totalSessions
      : 0;

    const avgPainAfter = totalSessions > 0
      ? sessions.reduce((sum: number, s: any) => sum + (s.pain_after || 0), 0) / totalSessions
      : 0;

    const avgImprovement = avgPainBefore - avgPainAfter;

    const latestPain = painLogs.length > 0 ? painLogs[painLogs.length - 1].pain_level : null;
    const baselinePain = painLogs.length > 0 ? painLogs[0].pain_level : null;
    const overallImprovement = baselinePain !== null && latestPain !== null
      ? baselinePain - latestPain
      : 0;

    // Streak calculation — consecutive days with a completed session
    let streak = 0;
    if (completedSessions > 0) {
      const sessionDates = [...new Set(
        sessions
          .filter((s: any) => s.completed)
          .map((s: any) => s.session_date)
      )].sort().reverse(); // newest first

      const today = new Date().toISOString().split("T")[0];
      let checkDate = today;
      for (const d of sessionDates) {
        if (d === checkDate) {
          streak++;
          const prev = new Date(checkDate);
          prev.setDate(prev.getDate() - 1);
          checkDate = prev.toISOString().split("T")[0];
        } else {
          break;
        }
      }
    }

    // Best single-session improvement
    const bestImprovement = sessions.length > 0
      ? Math.max(...sessions.map((s: any) => (s.pain_before || 0) - (s.pain_after || 0)))
      : 0;

    // Most used binaural beat
    const beatCounts: Record<string, number> = {};
    sessions.forEach((s: any) => {
      if (s.binaural_beat_used) {
        beatCounts[s.binaural_beat_used] = (beatCounts[s.binaural_beat_used] || 0) + 1;
      }
    });
    const favouriteBeat = Object.keys(beatCounts).length > 0
      ? Object.entries(beatCounts).sort((a, b) => b[1] - a[1])[0][0]
      : null;

    return Response.json({
      success: true,
      summary: {
        totalSessions,
        completedSessions,
        currentStreak: streak,
        avgPainBefore: Math.round(avgPainBefore * 10) / 10,
        avgPainAfter: Math.round(avgPainAfter * 10) / 10,
        avgImprovement: Math.round(avgImprovement * 10) / 10,
        bestImprovement,
        baselinePain,
        latestPain,
        overallImprovement: Math.round(overallImprovement * 10) / 10,
        favouriteBeat
      },
      sessions,
      painLogs
    });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});
