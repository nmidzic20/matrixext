import * as vscode from "vscode";
import { toggleKeyValueLayout } from "./toggleLayout";
import {
  convertSelectedBlocks,
  toggleSelectedBlocksLayout,
} from "./convertBlocks";
import { openColorPickerWebview } from "../webviews/colourPicker/open";
import { openReorderWebview } from "../webviews/reorder/open";

export function registerCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("rowtate.toggle", toggleKeyValueLayout),
    vscode.commands.registerCommand(
      "rowtate.reorderVertical",
      openReorderWebview,
    ),
    vscode.commands.registerCommand("rowtate.toggleBlocksLayout", () =>
      toggleSelectedBlocksLayout(),
    ),
    vscode.commands.registerCommand("rowtate.pickColors", () =>
      openColorPickerWebview(context),
    ),
  );
}
