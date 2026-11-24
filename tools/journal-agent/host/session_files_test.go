package host

import (
	"context"
	"encoding/base64"
	"errors"
	"strings"
	"testing"

	"journal-agent/client"
)

func TestTheHostWritesASessionsFilesReadableAndRefusesAPathOutsideItsFolder(t *testing.T) {
	containers, daemon := standIn(t, imageRules)
	skill := client.StartFolder{Name: "journal-skills", Files: []client.StartFile{
		{Path: "skills/journal/SKILL.md", Content: "# Journal\n"},
	}}

	if err := containers.WriteSessionFiles(context.Background(), "s1", []client.StartFolder{skill}); err != nil {
		t.Fatal(err)
	}
	leaving := client.StartFolder{Name: "journal-skills", Files: []client.StartFile{{Path: "../../x", Content: "x"}}}
	err := containers.WriteSessionFiles(context.Background(), "s1", []client.StartFolder{leaving})
	if !errors.Is(err, ErrSessionFilesUnsafe) {
		t.Fatalf("a path out of the folder was answered %v", err)
	}
	if err := containers.WriteSessionFiles(context.Background(), "../s1", nil); !errors.Is(err, ErrSessionFilesUnsafe) {
		t.Fatalf("a path for a session id was answered %v", err)
	}

	runs := daemon.Created()
	if len(runs) != 1 {
		t.Fatalf("a refused write still ran a container: %d ran", len(runs))
	}
	run := runs[0]
	if run.Config.User != "0:0" || mountIn(t, run.HostConfig.Mounts, "/journal").Source != journalRoot {
		t.Fatalf("the files were written as %s on %+v", run.Config.User, run.HostConfig.Mounts)
	}
	written := scriptOf(run)
	file := "/journal/sessions/s1/journal-skills/skills/journal/SKILL.md"
	content := base64.StdEncoding.EncodeToString([]byte("# Journal\n"))
	wanted := []string{`rm -rf -- "/journal/sessions/s1"`, content, `> "` + file + `"`, `chmod 0644 "` + file + `"`}
	for _, want := range wanted {
		if !strings.Contains(written, want) {
			t.Fatalf("the files were written without %q: %s", want, written)
		}
	}
}

func TestAContainedManifestMayMountTheSessionsFilesReadOnly(t *testing.T) {
	mounts := []ContainerMount{
		{Type: MountVolume, Source: "journal-workspace-s1", Target: "/workspace", IsWritable: true},
		{Type: MountDaemonBind, Source: "/srv/journal/sessions/s1", Target: SessionFilesTarget},
	}

	if !containedRules.permit(mounts) {
		t.Fatal("the session files mount was refused")
	}
}

func TestAContainedManifestMayMountTheHandedManagedSettingsReadOnly(t *testing.T) {
	mounts := []ContainerMount{
		{Type: MountVolume, Source: "journal-workspace-s1", Target: "/workspace", IsWritable: true},
		{Type: MountDaemonBind, Source: "/srv/journal/sessions/s1", Target: SessionFilesTarget},
		{Type: MountDaemonBind, Source: "/srv/journal/sessions/s1/managed/managed-settings.json", Target: ManagedSettingsTarget},
	}

	if !containedRules.permit(mounts) {
		t.Fatal("the managed settings mount was refused")
	}
}
