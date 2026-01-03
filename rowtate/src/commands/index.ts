import * as vscode from "vscode";
import { toggleKeyValueLayout } from "./toggleLayout";
import { toggleColoring } from "./toggleColoring";
import { convertSelectedBlocks } from "./convertBlocks";
import { openColorPickerWebview } from "../webviews/colourPicker/open";
import { openReorderWebview } from "../webviews/reorder/open";

export function registerCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("rowtate.toggle", toggleKeyValueLayout),
    vscode.commands.registerCommand("rowtate.toggleColoring", toggleColoring),
    vscode.commands.registerCommand(
      "rowtate.reorderVertical",
      openReorderWebview
    ),
    vscode.commands.registerCommand("rowtate.blocksToVertical", () =>
      convertSelectedBlocks("toVertical")
    ),
    vscode.commands.registerCommand("rowtate.blocksToHorizontal", () =>
      convertSelectedBlocks("toHorizontal")
    ),
    vscode.commands.registerCommand("rowtate.pickColors", () =>
      openColorPickerWebview(context)
    )
  );
}
