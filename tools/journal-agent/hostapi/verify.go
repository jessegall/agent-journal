package hostapi

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strings"
	"time"
)

// RefusalError is an order the host will not carry out, with the refusal it answers.
type RefusalError struct {
	Refusal Refusal
	Reason  string
}

func (refusal RefusalError) Error() string {
	return fmt.Sprintf("%s: %s", refusal.Refusal, refusal.Reason)
}

// Verifier checks an order's signature with the host's order secret and its expiry on the host's clock.
type Verifier struct {
	Secret []byte
	Now    func() time.Time
}

// Verify refuses an unsigned or altered order as unsafe and one past its expiry as expired.
func (verifier Verifier) Verify(order Order) error {
	if order.Signature == "" {
		return RefusalError{Refusal: Unsafe, Reason: "the order is not signed"}
	}
	expected := Sign(verifier.Secret, order)
	if !hmac.Equal([]byte(expected), []byte(order.Signature)) {
		return RefusalError{Refusal: Unsafe, Reason: "the order's signature does not match it"}
	}
	if !verifier.Now().Before(order.ExpiresAt) {
		return RefusalError{Refusal: Expired, Reason: "the order expired at " + order.ExpiresAt.UTC().Format(time.RFC3339)}
	}
	return nil
}

// Sign is the order's signature: HMAC-SHA256 hex over its id, sequence, type, process id, the SHA-256 hex of its
// payload bytes and its expiry in RFC 3339 UTC, one to a line, the same lines the journal signs.
func Sign(secret []byte, order Order) string {
	payloadDigest := sha256.Sum256([]byte(order.Payload))
	lines := strings.Join([]string{
		order.ID,
		fmt.Sprintf("%d", order.Sequence),
		order.Type,
		order.ProcessID,
		hex.EncodeToString(payloadDigest[:]),
		order.ExpiresAt.UTC().Format("2006-01-02T15:04:05Z"),
	}, "\n")
	mac := hmac.New(sha256.New, secret)
	mac.Write([]byte(lines))
	return hex.EncodeToString(mac.Sum(nil))
}
