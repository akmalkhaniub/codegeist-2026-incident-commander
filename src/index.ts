import crypto from "node:crypto";

export interface JiraIncidentAlert {
  issueKey: string;
  summary: string;
  severity: "P1" | "P2" | "P3";
  serviceName: string;
  errorRate: number;
}

export interface RemediationAction {
  actionId: string;
  issueKey: string;
  tool: "TRIGGER_ROLLBACK" | "DRAIN_CANARY" | "POST_COMMENT";
  status: "EXECUTED" | "ESCALATED";
  details: string;
  timestamp: string;
}

export class ForgeIncidentCommander {
  async processIncident(alert: JiraIncidentAlert): Promise<RemediationAction> {
    const timestamp = new Date().toISOString();
    const actionId = `act-${crypto.randomBytes(4).toString("hex")}`;

    if (alert.severity === "P1" && alert.errorRate > 0.05) {
      return {
        actionId,
        issueKey: alert.issueKey,
        tool: "TRIGGER_ROLLBACK",
        status: "EXECUTED",
        details: `Auto-remediation triggered for ${alert.serviceName}: Rollback to last stable build. Error rate: ${(alert.errorRate * 100).toFixed(1)}%.`,
        timestamp
      };
    }

    return {
      actionId,
      issueKey: alert.issueKey,
      tool: "POST_COMMENT",
      status: "EXECUTED",
      details: `Telemetry telemetry monitored for ${alert.serviceName}; error threshold below P1 auto-rollback trigger.`,
      timestamp
    };
  }
}

export async function handler(req: any) {
  const commander = new ForgeIncidentCommander();
  const alert: JiraIncidentAlert = req.payload || {
    issueKey: "OPS-101",
    summary: "Spike in 500 errors on checkout",
    severity: "P1",
    serviceName: "checkout-api",
    errorRate: 0.12
  };
  return await commander.processIncident(alert);
}
