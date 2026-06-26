# TRACE.jsonl

Append one JSON object per role action or handoff:

```json
{"version":1,"ts":"2026-06-16T00:00:00Z","iteration":1,"step_id":"I1","agent":"Planner Agent","role":"planner","event":"plan","summary":"Planned the next scoped step.","artifacts":["LOOP_STATE.json"],"decision":"continue"}
```

Required fields are `version`, `ts`, `iteration`, `agent`, `role`, `event`, and `summary`. Optional fields include `step_id`, `artifacts`, `result`, `decision`, `blockers`, and `risks`.
