package hostapi

import (
	"os"
	"path/filepath"
	"strings"
)

// PlanFile is one file an open plan hands the process, such as a program's settings: the host writes it into the
// process's own files folder before the process starts, and the plan names that folder as {folder:files}. Each name in
// the plan's folders is an empty folder of the process's own, named {folder:<name>}.
type PlanFile struct {
	Name    string `json:"name"`
	Content string `json:"content"`
	// Template is a file the journal generated, whose placeholders the host fills before writing it; a handed file,
	// such as a skill, is written as it is.
	Template bool `json:"template"`
}

// contentOf is what the host writes for the file: a template with its placeholders filled.
func (file PlanFile) contentOf(placeholders Placeholders) (string, error) {
	if !file.Template {
		return file.Content, nil
	}
	return placeholders.Fill(file.Content)
}

// filesFolderName is the placeholder name of a process's own files folder.
const filesFolderName = "files"

// writePlanFiles writes the plan's files and makes its folders inside the process's own folder, and answers the plan
// filled as PrepareOpenPlan fills it, with each variable it inherits that the host has.
func writePlanFiles(stateFolder, processID string, plan OpenPlan, hostNames map[string]string) (OpenPlan, error) {
	filled, err := PrepareOpenPlan(filepath.Join(stateFolder, "processes", processID), plan, hostNames)
	if err != nil {
		return plan, err
	}
	// The host's own values are added after filling, so a value of the host is never read as a placeholder.
	for _, name := range plan.Inherit {
		if value, isSet := os.LookupEnv(name); isSet {
			filled.Environment = append(filled.Environment, name+"="+value)
		}
	}
	return filled, nil
}

// PrepareOpenPlan writes the plan's files and makes its folders inside the process folder, private to the user, and
// answers the plan with those folders and the host's names filled in its argv, restart argv, environment and container
// mount sources. A device that runs a journal's plan on its owner's own terminal prepares it the same way.
func PrepareOpenPlan(processFolder string, plan OpenPlan, hostNames map[string]string) (OpenPlan, error) {
	folders := map[string]string{}
	names := append([]string{filesFolderName}, plan.Folders...)
	if len(plan.SideSockets) > 0 {
		names = append(names, sideSocketsFolderName)
	}
	for _, name := range names {
		if !isPlainName(name) {
			return plan, RefusalError{Refusal: Unsafe, Reason: "the plan folder name " + name + " is not a plain name"}
		}
		folders[name] = filepath.Join(processFolder, name)
		if err := os.MkdirAll(folders[name], 0o700); err != nil {
			return plan, err
		}
	}
	placeholders := Placeholders{Folders: folders, HostNames: hostNames}
	for _, file := range plan.Files {
		if !isInsidePath(file.Name) {
			return plan, RefusalError{Refusal: Unsafe, Reason: "the plan file name " + file.Name + " leaves its folder"}
		}
		content, err := file.contentOf(placeholders)
		if err != nil {
			return plan, err
		}
		target := filepath.Join(folders[filesFolderName], file.Name)
		if err := os.MkdirAll(filepath.Dir(target), 0o700); err != nil {
			return plan, err
		}
		if err := os.WriteFile(target, []byte(content), 0o600); err != nil {
			return plan, err
		}
	}
	return fillPlan(plan, placeholders)
}

// isInsidePath answers whether a path is relative, clean, inside its folder and its first part not hidden.
func isInsidePath(path string) bool {
	return path != "" && !filepath.IsAbs(path) && filepath.Clean(path) == path && path != ".." &&
		!strings.HasPrefix(path, "../") && !strings.HasPrefix(path, ".")
}

// isPlainName answers whether a name is one plain path part that is not hidden.
func isPlainName(name string) bool {
	return name != "" && name == filepath.Base(name) && !strings.HasPrefix(name, ".")
}

// fillPlan is the plan with its placeholders filled; an unknown placeholder refuses it.
func fillPlan(plan OpenPlan, placeholders Placeholders) (OpenPlan, error) {
	var err error
	if plan.Argv, err = fillAll(plan.Argv, placeholders); err != nil {
		return plan, err
	}
	if plan.RestartArgv, err = fillAll(plan.RestartArgv, placeholders); err != nil {
		return plan, err
	}
	if plan.Container != nil && placeholderPattern.MatchString(plan.RestartWhen.Folder) {
		return plan, RefusalError{
			Refusal: Unsafe,
			Reason:  "a container looks for its restart file inside itself, so its folder names no host placeholder",
		}
	}
	if plan.RestartWhen.Folder != "" {
		if plan.RestartWhen.Folder, err = placeholders.Fill(plan.RestartWhen.Folder); err != nil {
			return plan, err
		}
	}
	if plan.Environment, err = fillAll(plan.Environment, placeholders); err != nil {
		return plan, err
	}
	if plan.KeptFiles, err = fillAll(plan.KeptFiles, placeholders); err != nil {
		return plan, err
	}
	if plan.Container == nil {
		return plan, nil
	}
	container := *plan.Container
	container.Mounts = append(container.Mounts[:0:0], container.Mounts...)
	for index := range container.Mounts {
		if container.Mounts[index].Source, err = placeholders.Fill(container.Mounts[index].Source); err != nil {
			return plan, err
		}
	}
	plan.Container = &container
	return plan, nil
}

func fillAll(texts []string, placeholders Placeholders) ([]string, error) {
	if texts == nil {
		return nil, nil
	}
	filled := make([]string, len(texts))
	for index, text := range texts {
		value, err := placeholders.Fill(text)
		if err != nil {
			return nil, err
		}
		filled[index] = value
	}
	return filled, nil
}
