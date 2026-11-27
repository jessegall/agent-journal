package hostapi

import (
	"context"
	"errors"
	"testing"

	"journal-agent/host"
)

func imagesOrder(images string) Order {
	return Order{ID: "allow", Type: "allow_images", Payload: `{"images":[` + images + `]}`}
}

func TestAllowImagesReplacesTheImagesAContainedHostRuns(t *testing.T) {
	allowed := host.NewAllowedImages()
	table := &ProcessTable{containers: host.Containers{Rules: host.ContainerRules{Arrangement: host.Contained, Allowed: allowed}}}

	if _, err := carry(testOrders{ProcessTable: table}, "allow_images")(context.Background(), imagesOrder(`"agent@sha256:aaaa"`)); err != nil {
		t.Fatal(err)
	}

	if !allowed.Permits("agent@sha256:aaaa") || allowed.Permits("agent@sha256:bbbb") {
		t.Fatal("the order did not make its image the only one allowed")
	}
}

func TestAnImageThatIsNoDigestOrAHostWithNoSetRefusesTheOrder(t *testing.T) {
	contained := &ProcessTable{containers: host.Containers{Rules: host.ContainerRules{Arrangement: host.Contained, Allowed: host.NewAllowedImages()}}}
	local := &ProcessTable{containers: host.Containers{Rules: host.ContainerRules{Arrangement: host.Local}}}

	_, tagged := carry(testOrders{ProcessTable: contained}, "allow_images")(context.Background(), imagesOrder(`"agent:latest"`))
	_, unset := carry(testOrders{ProcessTable: local}, "allow_images")(context.Background(), imagesOrder(`"agent@sha256:aaaa"`))

	var refusal RefusalError
	if !errors.As(tagged, &refusal) || !errors.As(unset, &refusal) {
		t.Fatalf("a tag or a host with no set did not refuse: %v, %v", tagged, unset)
	}
}
