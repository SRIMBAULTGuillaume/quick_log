# Quick Log

This is a simple extension for Visual Studio Code.

This extension has two features:

- Write a line (just below your cursor) to print in the console the variable that is currently selected.
- Copy to your clipboard a string to print the selected variable.

I know that the print method is not the best way to debug your program but it can be usefull sometimes.

The default shorcut to print a variableis Ctrl+alt+l.
The default shorcut to copy this line is Ctrl+alt+shift+l.

The default printed/copied string has this format:

```javascript
console.log(`myVar: ${myVar}`);
```

This line depend of the current language of the file. You can change the format of these strings in the parameters.

This extension support multiples languages. There are currently supported languages:

- c (partial support)
- c++
- c#
- java
- javascript
- python
- go
- elixir (partial support)
- fsharp (partial support)

Todo-list:
- Add support for two (or more) way to start a function.
- Add new languages
- Add full support for c language (the log line depend of the type of the variable)
