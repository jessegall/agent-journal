package host

import "testing"

func TestAContainedHostMountsPlanFilesReadOnlyOnlyAtTheirFolderOrUnderEtc(t *testing.T) {
	rules := ContainerRules{Arrangement: Contained, InstallationName: "journal"}
	cases := map[string]struct {
		mount     ContainerMount
		permitted bool
	}{
		"the whole files folder":        {ContainerMount{Type: MountPlanFile, Target: PlanFileFolder}, true},
		"one file under /etc":           {ContainerMount{Type: MountPlanFile, Source: "settings.json", Target: "/etc/program/settings.json"}, true},
		"a writable plan file":          {ContainerMount{Type: MountPlanFile, Target: PlanFileFolder, IsWritable: true}, false},
		"a relative target":             {ContainerMount{Type: MountPlanFile, Target: "etc/settings.json"}, false},
		"a target leaving /etc":         {ContainerMount{Type: MountPlanFile, Target: "/etc/../root/settings.json"}, false},
		"a target outside /etc":         {ContainerMount{Type: MountPlanFile, Target: "/usr/settings.json"}, false},
		"a source in a folder":          {ContainerMount{Type: MountPlanFile, Source: "skills/a.md", Target: "/etc/a.md"}, false},
		"a hidden source":               {ContainerMount{Type: MountPlanFile, Source: ".env", Target: "/etc/a"}, false},
		"a writable daemon file at etc": {ContainerMount{Type: MountDaemonBind, Source: "/srv/journal/sessions/s/p/files", Target: "/etc/a", IsWritable: true}, false},
	}

	for name, sample := range cases {
		if rules.permit([]ContainerMount{sample.mount}) != sample.permitted {
			t.Errorf("%s: permitted is not %v", name, sample.permitted)
		}
	}
}

func TestPlanFilesThatLeaveTheirFolderAreNotWritten(t *testing.T) {
	for _, name := range []string{"/etc/passwd", "../escape", "a/../../b", ".."} {
		if _, err := planFilesArchive([]PlanFile{{Name: name, Content: "x"}}); err == nil {
			t.Errorf("the plan file %q was archived", name)
		}
	}
}
