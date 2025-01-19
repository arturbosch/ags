with import <nixpkgs> { };

mkShell {
  packages = [
    vscode-langservers-extracted
    libnotify
    prettierd
    typescript-language-server
    #ags
    #gtksourceview
    #webkitgtk
    #accountsservice
  ];
}
