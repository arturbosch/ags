with import <nixpkgs> { };

mkShell {
  packages = [
    vscode-langservers-extracted
    prettierd
    typescript-language-server
  ];
}
