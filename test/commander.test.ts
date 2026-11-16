import { test } from "node:test";
import assert from "node:assert";
import { ForgeIncidentCommander } from "../src/index.js";

test("ForgeIncidentCommander: automatically rolls back on P1 high error rate", async () => {
  const commander = new ForgeIncidentCommander();
  const action = await commander.processIncident({
    issueKey: "OPS-901",
    summary: "Checkout API HTTP 500 spike",
    severity: "P1",
    serviceName: "checkout-api",
    errorRate: 0.148
  });

  assert.strictEqual(action.tool, "TRIGGER_ROLLBACK");
  assert.strictEqual(action.status, "EXECUTED");
  assert.ok(action.details.includes("checkout-api"));
});

test("ForgeIncidentCommander: posts comment without rollback on low error rate", async () => {
  const commander = new ForgeIncidentCommander();
  const action = await commander.processIncident({
    issueKey: "OPS-902",
    summary: "Auth Gateway minor latency warning",
    severity: "P2",
    serviceName: "auth-gateway",
    errorRate: 0.02
  });

  assert.strictEqual(action.tool, "POST_COMMENT");
  assert.strictEqual(action.status, "EXECUTED");
});
