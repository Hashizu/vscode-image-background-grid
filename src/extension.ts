import * as vscode from 'vscode';
import { ImageEditorProvider } from './imageEditorProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Alpha Ichimatsu extension is active');

    context.subscriptions.push(ImageEditorProvider.register(context));
}
