import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const {
      user_id,
      session_number,
      pain_before,
      pain_after,
      injury_area,
      binaural_beat_used,
      notes
    } = await req.json();

    if (!user_id || pain_before === undefined || pain_after === undefined) {
      return Response.json({ error: "Missing required fields: user_id, pain_before, pain_after" }, { status: 400 });
    }

    // Validate pain range 0–10
    if (pain_before < 0 || pain_before > 10 || pain_after < 0 || pain_after > 10) {
      return Response.json({ error: "Pain levels must be between 0 and 10" }, { status: 400 });
    }

    const session_date = new Date().toISOString().split("T")[0];

    // Count existing sessions for this user to auto-number if not supplied
    let resolvedSessionNumber = session_number;
    if (!resolvedSessionNumber) {
      const existing = await base44.entities.Session.filter({ user_id });
      resolvedSessionNumber = existing.length + 1;
    }

    // Save session record
    const session = await base44.entities.Session.create({
      user_id,
      session_date,
      session_number: resolvedSessionNumber,
      pain_before,
      pain_after,
      injury_area: injury_area || "General",
      binaural_beat_used: binaural_beat_used || "healing_delta_2hz",
      completed: true,
      notes: notes || ""
    });

    // Log post-session pain tracking entry
    await base44.entities.PainTracking.create({
      user_id,
      log_date: session_date,
      pain_level: pain_after,
      injury_area: injury_area || "General",
      notes: `Post-session log (Session #${resolvedSessionNumber})`
    });

    const improvement = pain_before - pain_after;
    const improvementPct = pain_before > 0
      ? Math.round((improvement / pain_before) * 100)
      : 0;

    // Milestone messages
    let milestone = null;
    if (resolvedSessionNumber === 1) milestone = "First session complete — great start!";
    else if (resolvedSessionNumber === 7) milestone = "One week of healing — keep going!";
    else if (resolvedSessionNumber === 30) milestone = "30 sessions — incredible commitment!";

    return Response.json({
      success: true,
      session_id: session.id,
      session_number: resolvedSessionNumber,
      pain_improvement: improvement,
      improvement_pct: improvementPct,
      milestone
    });

  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});
