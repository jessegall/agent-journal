package client

import "testing"

// The reference value is App\AgentRequests\Support\SignedCall::signatureFor with the same inputs, so the host signs
// exactly as the journal checks.
func TestTheSignatureMatchesTheJournals(t *testing.T) {
	signed, err := signature("secret", "post", "/host/claim?limit=5&wait=0", "call-1", 1700000000, []byte(`{"a":1}`))

	if err != nil || signed != "a45317615427c985bf59396ca7f10fe948a52f1bfb89e17839c6a72577436a9d" {
		t.Fatalf("got %s, %v", signed, err)
	}
}

func TestAFieldWithALineBreakIsRefused(t *testing.T) {
	if _, err := signature("secret", "POST", "/host/claim", "call\n1", 1, nil); err == nil {
		t.Fatal("a line break was signed")
	}
}
