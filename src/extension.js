const vscode = require('vscode');

const fs = require("fs");
const clipboardy = require("clipboardy");

const notSupportedMsg = `
	The current language of the file is currently unsupported. 
	You add add it manually or create a pull request on github.com/SRIMBAULTGuillaume/quick_log`;

/**
 * @param {vscode.ExtensionContext} context
 */
let activate = context => {

	vscode.commands.registerCommand('quicklog.log', () => {

		const editor = vscode.window.activeTextEditor;
		if (!editor)
			return

		const doc = editor.document;

		const word = getWord(editor);

		const tabSize = editor.options.tabSize;
		var selectedLine = editor.selection.active.line;
		
		// Get the language's conf
		const languageConf = vscode.workspace
			.getConfiguration('quicklog')
			.get('languageConf')
			.find(e => e.id == doc.languageId);

		if (!languageConf) {
			vscode.window.showInformationMessage(notSupportedMsg);
			return;
		}

		var str = addSpaces(
			constructString(word, languageConf), 
			doc, 
			selectedLine, 
			tabSize, 
			languageConf.startFunction);

		

		editor.edit(edit => {
			// If it's the last line
			if (selectedLine+1 == doc.lineCount)
				edit.insert(new vscode.Position(selectedLine + 1), '\n' + str);
			else {
				//? Change replace by doc.lineAt().firstNonWhiteSpaceCharacter ?
				if (doc.lineAt(selectedLine + 1).text.replace(/ /g, '') === languageConf.startFunction) {
					str = ' '.repeat(tabSize) + str;
					selectedLine++;
				}
				edit.insert(new vscode.Position(selectedLine + 1), str);
			}
			
				
		});

	});

	vscode.commands.registerCommand('quicklog.copyLog', () => {

		const editor = vscode.window.activeTextEditor;
		if (!editor)
			return

		const doc = editor.document;

		// Get the conf
		var conf = vscode.workspace.getConfiguration('quicklog')

		const word = getWord(editor);

		// Get the langugae array
		var languageConf = conf.get('languageConf')

		languageConf = languageConf.find(e => e.id == doc.languageId);

		if (!languageConf) {
			vscode.window.showInformationMessage(notSupportedMsg);
			return;
		}

		clipboardy.writeSync(constructString(word, languageConf));
	});
}
exports.activate = activate;

// this method is called when your extension is deactivated
let deactivate = function() {}

module.exports = {
	activate,
	deactivate
}

const addSpaces = function (acc, doc, line, tabSize, startFunction){

	var charsInLine = doc.lineAt(line).text.split('');

	let nbSpace = 0;
	for (const e of charsInLine) {
		if (e === ' ')
			nbSpace++;
		else if (e === '\t')
			nbSpace += tabSize;
		else
			break;
	}

	// Testing if a tab is needed (to indent the text)
	let regex = new RegExp(startFunction + "$");
	if (regex.test(doc.lineAt(line).text))
		nbSpace += tabSize;

	return `${" ".repeat(nbSpace)}${acc}\n`;
}

const constructString = function(variable, conf){

	var str = conf.format.replace(/{w}/g, variable);

	return `${str}`;
}

const getWord = function(editor){

	const doc = editor.document;

	// Get the selected word (on the word where the cursor is on)
	const selection = doc.getWordRangeAtPosition(editor.selection.active)

	const word = doc.getText(selection);

	if (!word) {
		console.log('Nothing selected');
		return;
	}

	return word;
}

const useless = function () {
}
