package hostapi

import (
	"context"

	"journal-agent/host"
)

// placeContainerFiles writes a contained plan's files into its session's folder on the agent daemon, mounts each
// plan-file mount read-only from there, and fills {folder:files} with the folder the container sees them in. A
// contained plan names no host placeholder and nothing of this machine: no folders, side sockets, read files or
// inherited variables.
func (table *ProcessTable) placeContainerFiles(ctx context.Context, processID string, plan OpenPlan) (OpenPlan, error) {
	if len(plan.Folders) > 0 || len(plan.SideSockets) > 0 || len(plan.ReadFiles) > 0 || len(plan.Inherit) > 0 {
		return plan, RefusalError{Refusal: Unsafe, Reason: "a contained plan names nothing of the host it runs on"}
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

	session := plan.Labels.Session
	for index, mount := range filled.Container.Mounts {
		if mount.Type != host.MountPlanFile {
			continue
		}
		if mount.Source != "" && !names[mount.Source] {
			return plan, RefusalError{Refusal: Unsafe, Reason: "the plan-file mount names " + mount.Source + ", which the plan has not"}
		}
		source := host.SessionFilesFolder(session, processID)
		if mount.Source != "" {
			source += "/" + mount.Source
		}
		filled.Container.Mounts[index] = host.ContainerMount{Type: host.MountDaemonBind, Source: source, Target: mount.Target}
	}

	if len(files) > 0 {
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
