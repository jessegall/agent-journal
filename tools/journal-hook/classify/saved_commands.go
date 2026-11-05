package classify

import (
	"path/filepath"
	"slices"
	"strings"
)

type savedCommandTarget struct {
	program, subcommand, folder string
}

func (classifier *Classifier) SavedCommandConflict(candidate string, saved map[string]string) string {
	targets := classifier.savedCommandTargets(candidate)
	names := make([]string, 0, len(saved))
	for name := range saved {
		names = append(names, name)
	}
	slices.Sort(names)
	for _, name := range names {
		for _, target := range classifier.savedCommandTargets(saved[name]) {
			if slices.Contains(targets, target) {
				return name
			}
		}
	}
	return ""
}

func (classifier *Classifier) savedCommandTargets(line string) []savedCommandTarget {
	prepared := classifier.Line(line)
	if prepared.ParseError != "" {
		return nil
	}
	folder := "."
	var targets []savedCommandTarget
	for _, part := range prepared.Parts {
		if part.Program == "cd" && len(part.Arguments) == 1 {
			folder = commandFolder(folder, part.Arguments[0])
			continue
		}
		if !isTestOrBuild(part.Classification.Category) || classifier.loaded().Programs[part.Program] == nil {
			continue
		}
		targetFolder := folder
		for index, argument := range part.Arguments {
			if slices.Contains([]string{"-C", "--prefix", "--root", "--dir", "--cwd"}, argument) && index+1 < len(part.Arguments) {
				targetFolder = commandFolder(targetFolder, part.Arguments[index+1])
			}
			if flag, value, found := strings.Cut(argument, "="); found && slices.Contains([]string{"--prefix", "--root", "--dir", "--cwd"}, flag) {
				targetFolder = commandFolder(targetFolder, value)
			}
		}
		targets = append(targets, savedCommandTarget{part.Program, part.Subcommand, targetFolder})
	}
	return targets
}

func commandFolder(folder, target string) string {
	if filepath.IsAbs(target) {
		return filepath.Clean(target)
	}
	return filepath.Join(folder, target)
}

func isTestOrBuild(category string) bool {
	return category == "test run" || category == "build"
}
