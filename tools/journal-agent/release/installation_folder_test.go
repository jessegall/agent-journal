package release

import (
	"path/filepath"
	"testing"
)

func TestAReleaseFolderIsNamedForItsVersionAndProgramList(t *testing.T) {
	first := InstallationFolder("/home/me/.journal-agent", "6.1.0", []byte(`{"drivers":[]}`))
	same := InstallationFolder("/home/me/.journal-agent", "6.1.0", []byte(`{"drivers":[]}`))
	changed := InstallationFolder("/home/me/.journal-agent", "6.1.0", []byte(`{"drivers":[{"name":"x"}]}`))

	if filepath.Dir(first) != "/home/me/.journal-agent/releases" || len(filepath.Base(first)) != len("6.1.0-")+8 {
		t.Fatalf("the folder %s is not releases/<version>-<8 hex>", first)
	}
	if first != same || first == changed {
		t.Fatalf("the same list named %s and %s, a changed list %s", first, same, changed)
	}
}
