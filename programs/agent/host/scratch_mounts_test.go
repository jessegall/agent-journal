package host

import (
	"slices"
	"testing"

	"github.com/moby/moby/api/types/mount"
)

func TestAContainedHostMountsScratchOnlyAsAWritableFolderAtACleanTarget(t *testing.T) {
	rules := ContainerRules{Arrangement: Contained, InstallationName: "journal"}
	cases := map[string]struct {
		mount     ContainerMount
		permitted bool
	}{
		"the account's tmp":          {ContainerMount{Type: MountScratch, Target: accountTarget + "/tmp", IsWritable: true}, true},
		"a read-only scratch":        {ContainerMount{Type: MountScratch, Target: accountTarget + "/tmp"}, false},
		"a scratch with a source":    {ContainerMount{Type: MountScratch, Source: "/srv/x", Target: accountTarget + "/tmp", IsWritable: true}, false},
		"a relative target":          {ContainerMount{Type: MountScratch, Target: "home/tmp", IsWritable: true}, false},
		"a target that leaves":       {ContainerMount{Type: MountScratch, Target: accountTarget + "/../tmp", IsWritable: true}, false},
		"a target of two arguments":  {ContainerMount{Type: MountScratch, Target: "/a,b", IsWritable: true}, false},
		"a volume at an account tmp": {ContainerMount{Type: MountVolume, Source: "journal-x", Target: accountTarget + "/tmp", IsWritable: true}, false},
	}

	for name, sample := range cases {
		if rules.permit([]ContainerMount{sample.mount}) != sample.permitted {
			t.Errorf("%s: permitted is not %v", name, sample.permitted)
		}
	}
}

func TestAScratchFolderIsHeldInTheContainersMemory(t *testing.T) {
	daemon := ContainerMount{Type: MountScratch, Target: accountTarget + "/tmp", IsWritable: true}.daemonMount()

	if daemon.Type != mount.TypeTmpfs || daemon.Target != accountTarget+"/tmp" || daemon.Source != "" || daemon.ReadOnly {
		t.Fatalf("the scratch folder is mounted as %+v", daemon)
	}
}

func TestTheAccountMountPointsAreTheFoldersRightInsideTheAccountMountThatAreMountedOver(t *testing.T) {
	manifest := ContainerManifest{Mounts: []ContainerMount{
		{Type: MountBind, Target: "/work"},
		{Type: MountDaemonBind, Source: accountsRoot + "/a1", Target: "/home/u/.acct"},
		{Type: MountVolume, Source: "journal-history-s1", Target: "/home/u/.acct/history"},
		{Type: MountScratch, Target: "/home/u/.acct/tmp", IsWritable: true},
		{Type: MountScratch, Target: "/home/u/.acct/a/deeper", IsWritable: true},
	}}

	if folders := manifest.AccountMountPoints(); !slices.Equal(folders, []string{"history", "tmp"}) {
		t.Fatalf("the mount points are %v", folders)
	}
}

func TestAManifestWithNoAccountMountHasNoAccountMountPoints(t *testing.T) {
	manifest := ContainerManifest{Mounts: []ContainerMount{{Type: MountScratch, Target: "/home/u/tmp", IsWritable: true}}}

	if folders := manifest.AccountMountPoints(); folders != nil {
		t.Fatalf("the mount points are %v", folders)
	}
}

func TestTheMountPointsScriptMakesEachMissingFolderAndStopsAtTheFirstFailure(t *testing.T) {
	script := mountPointsScript("/account", []string{"projects", "tmp"})
	want := "set -e\n" +
		"[ -L '/account/projects' ] || [ -e '/account/projects' ] || mkdir -m 0700 '/account/projects'\n" +
		"[ -L '/account/tmp' ] || [ -e '/account/tmp' ] || mkdir -m 0700 '/account/tmp'"

	if script != want {
		t.Fatalf("the script is\n%s", script)
	}
}
