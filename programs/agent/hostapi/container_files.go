package hostapi

import (
	"context"
	"reflect"
	"slices"
	"strings"

	"journal-agent/host"
)

// placeContainerFiles writes a contained plan's files into its session's folder on the agent daemon, mounts each
// plan-file mount read-only from there, and fills {folder:files} with the folder the container sees them in. A
// contained plan names no host placeholder and nothing of this machine: no folders, side sockets, read files or
// inherited variables.
func (table *ProcessTable) placeContainerFiles(ctx context.Context, processID string, plan OpenPlan) (OpenPlan, error) {
	if named := hostThingsNamed(plan); len(named) > 0 {
		return plan, RefusalError{Refusal: Unsafe, Reason: "a contained plan names nothing of the host it runs on, but names " + strings.Join(named, ", ")}
	}
	if missing := missingGrantVariables(plan.Environment); len(missing) > 0 {
		return plan, RefusalError{Refusal: Unsafe, Reason: "a contained plan carries its start grant whole, but misses " + strings.Join(missing, ", ")}
	}

	placeholders := Placeholders{Folders: map[string]string{filesFolderName: host.PlanFileFolder}}
	files, names, err := containerPlanFiles(plan.Files, placeholders)
	if err != nil {
		return plan, err
	}

	filled, err := fillPlan(plan, placeholders)
	if err != nil {
		return plan, err
	}

	session := plan.startLabels("").Session
	mountsPlanFiles := false
	for index, mount := range filled.Container.Mounts {
		if mount.Type != host.MountPlanFile {
			continue
		}
		mountsPlanFiles = true
		if mount.Source != "" && !names[mount.Source] {
			return plan, RefusalError{Refusal: Unsafe, Reason: "the plan-file mount names " + mount.Source + ", which the plan has not"}
		}
		source := host.SessionFilesFolder(session, processID)
		if mount.Source != "" {
			source += "/" + mount.Source
		}
		filled.Container.Mounts[index] = host.ContainerMount{Type: host.MountDaemonBind, Source: source, Target: mount.Target}
	}

	// A plan-file mount binds the folder even when the plan has no file, so the folder is made either way.
	if mountsPlanFiles {
		if err := table.containers.WritePlanFiles(ctx, session, processID, files); err != nil {
			return plan, err
		}
	}

	return filled, nil
}

// containerPlanFiles are the plan's files as the host writes them, templates filled, and the set of their names.
func containerPlanFiles(planFiles []PlanFile, placeholders Placeholders) ([]host.PlanFile, map[string]bool, error) {
	files := make([]host.PlanFile, 0, len(planFiles))
	names := map[string]bool{}
	for _, file := range planFiles {
		if !isInsidePath(file.Name) {
			return nil, nil, RefusalError{Refusal: Unsafe, Reason: "the plan file name " + file.Name + " leaves its folder"}
		}
		content, err := file.contentOf(placeholders)
		if err != nil {
			return nil, nil, err
		}
		files = append(files, host.PlanFile{Name: file.Name, Content: content})
		names[file.Name] = true
	}

	return files, names, nil
}

// missingGrantVariables are the variables of ContainedStartGrantEnvironment a plan that carries any of them lacks.
func missingGrantVariables(environment []string) []string {
	carried := map[string]bool{}
	for _, entry := range environment {
		carried[strings.SplitN(entry, "=", 2)[0]] = true
	}
	missing := []string{}
	for _, name := range ContainedStartGrantEnvironment {
		if !carried[name] {
			missing = append(missing, name)
		}
	}
	if len(missing) == len(ContainedStartGrantEnvironment) {
		return nil
	}
	return missing
}

// hostThingsNamed are the fields of the protocol's ContainedRefusedFields the plan sets, by their JSON names.
func hostThingsNamed(plan OpenPlan) []string {
	named := []string{}
	value := reflect.ValueOf(plan)
	for index := range value.NumField() {
		name := strings.Split(value.Type().Field(index).Tag.Get("json"), ",")[0]
		if slices.Contains(ContainedRefusedFields, name) && !value.Field(index).IsZero() && value.Field(index).Len() > 0 {
			named = append(named, name)
		}
	}
	return named
}
