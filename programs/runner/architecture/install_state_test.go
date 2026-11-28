package architecture

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestTheRelayInstallerWritesItsProgramListInTheInstallationState(t *testing.T) {
	script, err := os.ReadFile(filepath.Join("..", "scripts", "install-relay.sh"))
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(script), `--into-root "$state_folder" --state "$state_folder"`) {
		t.Fatal("install-release must keep its program list in the same state folder as the release")
	}
}
