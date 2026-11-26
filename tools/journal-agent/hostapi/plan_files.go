package hostapi

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"
)

// PlanFile is one file an open plan hands the process, such as a program's settings: the host writes it into the
// process's own files folder before the process starts, and the plan names that folder as {folder:files}. Each name in
// the plan's folders is an empty folder of the process's own, named {folder:<name>}.
type PlanFile struct {
	Name    string `json:"name"`
	Content string `json:"content"`
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
	for _, file := range plan.Files {
		if !isInsidePath(file.Name) {
			return plan, RefusalError{Refusal: Unsafe, Reason: "the plan file name " + file.Name + " leaves its folder"}
		}
		target := filepath.Join(folders[filesFolderName], file.Name)
		if err := os.MkdirAll(filepath.Dir(target), 0o700); err != nil {
			return plan, err
		}
		if err := os.WriteFile(target, []byte(file.Content), 0o600); err != nil {
			return plan, err
		}
	}
	filled, err := fillPlan(plan, Placeholders{Folders: folders, HostNames: hostNames})
	if err != nil {
		return plan, err
	}
	if plan.Seatbelt != "" {
		if !isInsidePath(plan.Seatbelt) {
			return plan, RefusalError{Refusal: Unsafe, Reason: "the Seatbelt profile " + plan.Seatbelt + " leaves its folder"}
		}
		filled.Argv = underSeatbelt(filled.Argv, filepath.Join(folders[filesFolderName], plan.Seatbelt))
	}
	return filled, nil
}

// seatbeltExecutable is macOS's Seatbelt launcher, which runs a process under the profile it is given.
const seatbeltExecutable = "/usr/bin/sandbox-exec"

// underSeatbelt runs the argv under the profile where the host has Seatbelt, and as it is elsewhere.
func underSeatbelt(argv []string, profile string) []string {
	if runtime.GOOS != "darwin" {
		return argv
	}
	return append([]string{seatbeltExecutable, "-f", profile}, argv...)
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
