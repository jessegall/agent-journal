package hostapi

import (
	"context"
	"encoding/json"
	"testing"
)

// A driver image the journal no longer keeps is removed from the agent daemon, and removing it again finds it gone
// already, so a repeated order never fails.
func TestADroppedDriverImageIsRemovedFromTheDaemon(t *testing.T) {
	table, daemon, _ := containedTable(t, 0)
	if _, held := daemon.Images[mockImage]; !held {
		t.Fatalf("the stand-in daemon holds no image %s, so this scenario proves nothing", mockImage)
	}

	for range 2 {
		if _, err := carry(testInstructions{ProcessTable: table}, "remove_image")(context.Background(), imageRemovalOf(t, mockImage)); err != nil {
			t.Fatalf("removing the dropped image failed: %v", err)
		}
	}

	if _, held := daemon.Images[mockImage]; held {
		t.Fatalf("the dropped image %s is still on the daemon", mockImage)
	}
}

// imageRemovalOf is the journal's order to remove the image, as a claim hands it out.
func imageRemovalOf(t *testing.T, image string) Instruction {
	t.Helper()
	payload, err := json.Marshal(ImageRemoval{Image: image})
	if err != nil {
		t.Fatal(err)
	}
	return Instruction{ID: "remove-image", Type: "remove_image", Payload: string(payload)}
}
