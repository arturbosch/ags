with import <nixpkgs> { };

mkShell {
  packages = [
    nodePackages.live-server
    vscode-langservers-extracted
    prettierd
    typescript-language-server
  ];
}
