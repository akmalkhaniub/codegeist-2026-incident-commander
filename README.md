# 🚀 Forge Incident Commander — Codegeist 2026

[![Atlassian Forge](https://img.shields.io/badge/Atlassian-Forge%20Cloud-0052cc.svg)](https://developer.atlassian.com/platform/forge/)
[![TypeScript: strict](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)](https://www.typescriptlang.org)
[![Event: Codegeist 2026](https://img.shields.io/badge/Devpost-Codegeist%202026-blue.svg)](https://devpost.com)
[![Tests: Passing](https://img.shields.io/badge/Tests-2%2F2%20Passed-emerald.svg)](./test)

> **Built for [Codegeist 2026 (Devpost)](https://devpost.com)**  
> *Timeline: October 27 – December 22, 2026 • Prize Pool: $120,000*

Forge Incident Commander is an autonomous SRE triage and auto-remediation app for Jira Cloud. Operating natively within the Atlassian Forge serverless runtime, it continuously analyzes high-severity (P1) incident tickets, assesses real-time production error rates, and triggers automated rollbacks and canary drains while maintaining a complete audit trail in Jira comments.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    CloudWatch["🚨 CloudWatch / PagerDuty Alert"] --> Jira["📋 Jira Service Management\n(P1 Incident Ticket)"]
    
    subgraph Atlassian_Forge ["⚡ Atlassian Forge Serverless Runtime"]
        Jira --> Panel["🖼️ Incident Commander Panel\n(jira:issuePanel)"]
        Panel --> Resolver["🧠 Forge Resolver Function\n(ForgeIncidentCommander)"]
        
        Resolver --> Decision{"Error Rate > 5%?"}
        Decision -->|"Yes (P1 Outage)"| AutoRollback["⏪ Auto-Trigger Rollback & Canary Drain"]
        Decision -->|"No (Stable)"| PostComment["💬 Post Diagnostic Comment to Ticket"]
    end
    
    AutoRollback --> Audit["📄 Jira Audit Log & Post-Mortem Update"]
    PostComment --> Audit
    
    classDef atlassian fill:#0052cc,stroke:#2684ff,stroke-width:2px,color:#fff;
    classDef sre fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff;
    class Jira,Panel,Audit atlassian;
    class Resolver,AutoRollback,PostComment sre;
```

---

## 🚀 Quickstart & Verification

```bash
# 1. Run automated test suite
npm test

# 2. Build production Forge distribution
npm run build
```
