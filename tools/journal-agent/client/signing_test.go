package client

import "testing"

// The reference values are App\Support\SignedCall::signatureFor and ::agentSignatureFor with the same inputs, so the
// host signs exactly as the journal checks: method, target, call id, issue time and body digest, with an agent call's
// profile key and revision after them, and no format version.
func TestTheSignatureMatchesTheJournals(t *testing.T) {
	signed, err := signature("secret", "post", "/host/claim?limit=5&wait=0", "call-1", 1700000000, []byte(`{"a":1}`))

	if err != nil || signed != "9b1520aa01cc3d350a35645a7027689a959a3000edcf1b5820eb7cc1b4a45ce5" {
		t.Fatalf("got %s, %v", signed, err)
	}
}

func TestAnAgentCallSignatureMatchesTheJournals(t *testing.T) {
	signed, err := signature("secret", "post", "/api/project-commands", "call-1", 1700000000, []byte(`{"a":1}`), "worker", "3")

	if err != nil || signed != "66a74b68e997a768590262351d2230eac446f2a92e927a6de2a654ee98863e29" {
		t.Fatalf("got %s, %v", signed, err)
	}
}

func TestAFieldWithALineBreakIsRefused(t *testing.T) {
	if _, err := signature("secret", "POST", "/host/claim", "call\n1", 1, nil); err == nil {
		t.Fatal("a line break was signed")
	}
}
