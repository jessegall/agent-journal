package hostapi

import (
	"encoding/json"
	"os"
	"reflect"
	"testing"
)

// conformance are the committed vectors of host protocol 1 that the Go host and the PHP journal both check.
type conformance struct {
	Secret string `json:"secret"`
	Orders []struct {
		Order   Order          `json:"order"`
		Payload map[string]any `json:"payload"`
	} `json:"orders"`
	Answers   []Answer        `json:"answers"`
	Reports   []ProcessReport `json:"reports"`
	Inventory Inventory       `json:"inventory"`
}

func loadConformance(t *testing.T) (conformance, []byte) {
	t.Helper()
	content, err := os.ReadFile("testdata/conformance.json")
	if err != nil {
		t.Fatal(err)
	}
	var vectors conformance
	if err := json.Unmarshal(content, &vectors); err != nil {
		t.Fatal(err)
	}
	return vectors, content
}

func TestTheCommittedOrdersAreSignedAsTheHostChecks(t *testing.T) {
	vectors, _ := loadConformance(t)
	for _, vector := range vectors.Orders {
		if got := Sign([]byte(vectors.Secret), vector.Order); got != vector.Order.Signature {
			t.Errorf("order %s signs to %s, not %s", vector.Order.ID, got, vector.Order.Signature)
		}
		var payload map[string]any
		if err := json.Unmarshal([]byte(vector.Order.Payload), &payload); err != nil || !reflect.DeepEqual(payload, vector.Payload) {
			t.Errorf("order %s carries the payload %v, not %v", vector.Order.ID, payload, vector.Payload)
		}
	}
}

func TestTheCommittedAnswersReportsAndInventoryAreTheBytesTheHostWrites(t *testing.T) {
	vectors, _ := loadConformance(t)
	written, err := json.Marshal(map[string]any{"answers": vectors.Answers, "reports": vectors.Reports, "inventory": vectors.Inventory})
	if err != nil {
		t.Fatal(err)
	}
	var again, committed map[string]any
	_ = json.Unmarshal(written, &again)
	_, content := loadConformance(t)
	_ = json.Unmarshal(content, &committed)
	for _, part := range []string{"answers", "reports", "inventory"} {
		if !reflect.DeepEqual(again[part], committed[part]) {
			t.Errorf("the host writes its %s otherwise than the committed vectors", part)
		}
	}
}

func TestAnUnknownOrderIsRefusedByName(t *testing.T) {
	record, err := OpenAnsweredRecord(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	var answer Answer
	dispatcher := NewDispatcher(testVerifier(), record, map[string]Executor{}, func(_ Order, given Answer) { answer = given })
	order := signedOrder("unknown", "", 1)
	order.Type = "teleport"
	order.Signature = Sign(testSecret, order)

	dispatcher.Submit(t.Context(), order)
	dispatcher.Wait()

	if answer.Refusal != UnknownOrder {
		t.Fatalf("an unknown order was answered %+v", answer)
	}
}
