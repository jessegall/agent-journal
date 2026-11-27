package hostapi

import (
	"context"

	"journal-agent/host"
)

// AllowImages makes the pinned images the journal names the only ones a container of this host may run; an image
// that is no exact digest, or a host that holds no allowed set, refuses the order.
func (table *ProcessTable) AllowImages(_ context.Context, order Order, plan ImagesPlan) (map[string]any, error) {
	if table.containers.Rules.Allowed == nil {
		return nil, RefusalError{Refusal: Unsafe, Reason: "this host runs no containers of allowed images"}
	}
	for _, image := range plan.Images {
		if !host.IsPinnedReference(image) {
			return nil, RefusalError{Refusal: Unsafe, Reason: "the image " + image + " is no exact digest"}
		}
	}
	table.containers.Rules.Allowed.Replace(plan.Images)

	return map[string]any{"allowed": len(plan.Images)}, nil
}
