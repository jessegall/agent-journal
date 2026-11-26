package hostapi

import (
	"context"

	"journal-agent/host"
)

// ImagesPlan is the payload of allow_images: the only pinned images this host's containers may run from now.
type ImagesPlan struct {
	Images []string `json:"images"`
}

// allowImages makes the pinned images the journal names the only ones a container of this host may run; an image
// that is no exact digest, or a host that holds no allowed set, refuses the order.
func (table *ProcessTable) allowImages(_ context.Context, order Order) (map[string]any, error) {
	plan, err := decodePayload[ImagesPlan](order)
	if err != nil {
		return nil, err
	}
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
