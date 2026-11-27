package hostapi

import (
	"errors"
	"os"
	"path/filepath"
	"slices"
	"testing"

	"journal-agent/host"
)

func TestAPlansFilesAreWrittenPrivatelyAndItsFilesFolderIsFilledIn(t *testing.T) {
	state := t.TempDir()
	plan := OpenPlan{
		Argv:        []string{"program", "--settings", "{folder:files}/settings.json"},
		Environment: []string{"SETTINGS={folder:files}", "HOME={folder:home}", "JOURNAL_URL={host:JOURNAL_URL}"},
		Folders:     []string{"home"},
		Inherit:     []string{"JOURNAL_PLAN_TEST_SET", "JOURNAL_PLAN_TEST_UNSET"},
		Container:   &host.ContainerManifest{Mounts: []host.ContainerMount{{Source: "{folder:files}", Target: "/settings"}}},
		Files:       []PlanFile{{Name: "settings.json", Content: `{"permissions":{}}`}, {Name: "skills/one/SKILL.md", Content: "skill"}},
	}

	t.Setenv("JOURNAL_PLAN_TEST_SET", "kept")
	filled, err := writePlanFiles(state, "p1", plan, map[string]string{"JOURNAL_URL": "http://journal"})
	if err != nil {
		t.Fatal(err)
	}

	folder := filepath.Join(state, "processes", "p1", "files")
	home := filepath.Join(state, "processes", "p1", "home")
	content, readErr := os.ReadFile(filepath.Join(folder, "settings.json"))
	info, statErr := os.Stat(filepath.Join(folder, "settings.json"))
	if readErr != nil || statErr != nil || string(content) != `{"permissions":{}}` || info.Mode().Perm() != 0o600 {
		t.Fatalf("the settings file was not written privately: %q %v %v", content, readErr, statErr)
	}
	wanted := []string{"SETTINGS=" + folder, "HOME=" + home, "JOURNAL_URL=http://journal", "JOURNAL_PLAN_TEST_SET=kept"}
	if homeInfo, err := os.Stat(home); err != nil || !homeInfo.IsDir() || !slices.Equal(filled.Environment, wanted) {
		t.Fatalf("the home folder or the inherited variable is missing: %v %v", filled.Environment, err)
	}
	if filled.Argv[2] != folder+"/settings.json" ||
		filled.Container.Mounts[0].Source != folder || plan.Container.Mounts[0].Source != "{folder:files}" {
		t.Fatalf("the files folder was not filled in, or the order's own plan changed: %+v", filled)
	}
}

func TestATemplateFileHasItsPlaceholdersFilledAndAHandedFileIsWrittenAsItIs(t *testing.T) {
	state := t.TempDir()
	command := `{"command":"{host:HOOK_COMMAND} a-program {folder:files}/hook-replies.json"}`
	plan := OpenPlan{Files: []PlanFile{
		{Name: "settings.json", Content: command, Template: true},
		{Name: "skills/one/SKILL.md", Content: "Write {folder:files} as it is."},
	}}

	if _, err := writePlanFiles(state, "p1", plan, map[string]string{"HOOK_COMMAND": "/bin/journal-hook"}); err != nil {
		t.Fatal(err)
	}

	folder := filepath.Join(state, "processes", "p1", "files")
	settings, _ := os.ReadFile(filepath.Join(folder, "settings.json"))
	skill, _ := os.ReadFile(filepath.Join(folder, "skills", "one", "SKILL.md"))
	wanted := `{"command":"/bin/journal-hook a-program ` + folder + `/hook-replies.json"}`
	if string(settings) != wanted || string(skill) != "Write {folder:files} as it is." {
		t.Fatalf("the template was %q and the handed file %q", settings, skill)
	}
}

func TestAPlanFileOutsideItsFolderOrAnUnknownFolderIsRefused(t *testing.T) {
	for _, plan := range []OpenPlan{
		{Files: []PlanFile{{Name: "../escape", Content: "x"}}},
		{Files: []PlanFile{{Name: ".hidden", Content: "x"}}},
		{Argv: []string{"{folder:elsewhere}/program"}},
		{Argv: []string{"{host:UNKNOWN}/program"}},
		{Folders: []string{"../up"}},
	} {
		_, err := writePlanFiles(t.TempDir(), "p2", plan, nil)

		var refusal RefusalError
		if !errors.As(err, &refusal) || refusal.Refusal != Unsafe {
			t.Fatalf("the plan %+v was not refused as unsafe: %v", plan, err)
		}
	}
}

func TestAContainerPlansRestartFileNamingAHostPlaceholderIsRefused(t *testing.T) {
	container := &host.ContainerManifest{}
	inside := OpenPlan{Argv: []string{"program"}, Container: container,
		RestartWhenFile: &host.RestartFile{Folder: "/home/journal/.account", Glob: "*.jsonl"}}
	placed := inside
	placed.RestartWhenFile = &host.RestartFile{Folder: "{folder:home}/.program/projects", Glob: "*.jsonl"}

	_, insideErr := fillPlan(inside, Placeholders{Folders: map[string]string{"home": "/state/home"}})
	_, placedErr := fillPlan(placed, Placeholders{Folders: map[string]string{"home": "/state/home"}})

	var refusal RefusalError
	if insideErr != nil || !errors.As(placedErr, &refusal) || refusal.Refusal != Unsafe {
		t.Fatalf("a container path was refused (%v) or a host placeholder was let through (%v)", insideErr, placedErr)
	}
}
