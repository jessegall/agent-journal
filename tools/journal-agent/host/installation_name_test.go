package host

import (
	"errors"
	"testing"
)

func TestASessionIsNamedAfterItsInstallationAndALocalOneAsBefore(t *testing.T) {
	acme, err := ParseInstallationName("acme")
	if err != nil {
		t.Fatal(err)
	}

	if got := acme.ResourceName("s1"); got != "acme-s1" {
		t.Fatalf("the contained session is named %s", got)
	}

	if got := InstallationName("").ResourceName("s1"); got != "journal-s1" {
		t.Fatalf("the local session is named %s", got)
	}

	if got := acme.VolumeName(WorkspaceVolume, "s1"); got != "acme-workspace-s1" {
		t.Fatalf("the workspace volume is named %s", got)
	}
}

func TestAnInstallationNameIsLowercaseLettersDigitsAndDashes(t *testing.T) {
	for _, bad := range []string{"-acme", "Acme", "acme_1", "a/b", "abcdefghijklmnopqrstuvwxyzabcdefghijklmno"} {
		if _, err := ParseInstallationName(bad); !errors.Is(err, ErrInstallationNameInvalid) {
			t.Fatalf("%q gave %v", bad, err)
		}
	}

	if name, err := ParseInstallationName(""); err != nil || name != "" {
		t.Fatalf("no flag gave %q, %v", name, err)
	}
}
