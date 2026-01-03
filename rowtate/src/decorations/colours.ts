import * as vscode from "vscode";

function getRowtateColors() {
  const cfg = vscode.workspace.getConfiguration("rowtate");
  return {
    comment: cfg.get<string>("colors.comment", "#87c66b"),
    key: cfg.get<string>("colors.key", "#cd6060ff"),
    value: cfg.get<string>("colors.value", "#6aa2f7ff"),
    target: cfg.get<string>("colors.target", "user") as "user" | "workspace",
  };
}
export { getRowtateColors };
