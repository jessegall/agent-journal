package hostapi

import (
	"context"

	"journal-agent/host"
)

// AllowImages makes the pinned images the journal names the only ones a container of this host may run; an image
// that is no exact digest, or a host that holds no allowed set, refuses the instruction.
func (table *ProcessTable) AllowImages(_ context.Context, instruction Instruction, plan ImagesPlan) (ImagesAllowed, error) {
	if table.containers.Rules.Allowed == nil {
		return ImagesAllowed{}, RefusalError{Refusal: Unsafe, Reason: "this host runs no containers of allowed images"}
	}
	for _, image := range plan.Images {
		if !host.IsPinnedReference(image) {
			return ImagesAllowed{}, RefusalError{Refusal: Unsafe, Reason: "the image " + image + " is no exact digest"}
		}
	}
	table.containers.Rules.Allowed.Replace(plan.Images)

	return ImagesAllowed{Allowed: len(plan.Images)}, nil
}
