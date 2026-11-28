package release

import "testing"

func TestTheRemoteProjectProfileBuildsTheTerminalCommand(t *testing.T) {
	for _, file := range RemoteProject.Files {
		if file.Name == "bin/journal-terminal" {
			if file.Source != (GoProgram{Package: "./cmd/journal-terminal"}) || !file.Executable {
				t.Fatalf("the terminal file has the wrong source or mode: %+v", file)
			}
			return
		}
	}
	t.Fatal("the remote project profile has no terminal command")
}
