package hostapi

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strings"
	"time"
)

// RefusalError is an instruction the host will not carry out, with the refusal it answers.
type RefusalError struct {
	Refusal Refusal
	Reason  string
	// Facts are the typed facts a refusal of protocol 1 carries, such as an image fault's; none for the others.
	Facts map[string]any
}

func (refusal RefusalError) Error() string {
	return fmt.Sprintf("%s: %s", refusal.Refusal, refusal.Reason)
}

// Verifier checks an instruction's signature with the host's instruction secret and its expiry on the host's clock.
type Verifier struct {
	Secret []byte
	Now    func() time.Time
}

// Verify refuses an unsigned or altered instruction as unsafe and one past its expiry as expired.
func (verifier Verifier) Verify(instruction Instruction) error {
	if instruction.Signature == "" {
		return RefusalError{Refusal: Unsafe, Reason: "the instruction is not signed"}
	}
	expected := Sign(verifier.Secret, instruction)
	if !hmac.Equal([]byte(expected), []byte(instruction.Signature)) {
		return RefusalError{Refusal: Unsafe, Reason: "the instruction's signature does not match it"}
	}
	if !verifier.Now().Before(instruction.ExpiresAt) {
		return RefusalError{Refusal: Expired, Reason: "the instruction expired at " + instruction.ExpiresAt.UTC().Format(time.RFC3339)}
	}
	return nil
}

// Sign is the instruction's signature: HMAC-SHA256 hex over its id, sequence, type, process id, the SHA-256 hex of its
// payload bytes and its expiry in RFC 3339 UTC, one to a line, the same lines the journal signs.
func Sign(secret []byte, instruction Instruction) string {
	payloadDigest := sha256.Sum256([]byte(instruction.Payload))
	lines := strings.Join([]string{
		instruction.ID,
		fmt.Sprintf("%d", instruction.Sequence),
		instruction.Type,
		instruction.ProcessID,
		hex.EncodeToString(payloadDigest[:]),
		instruction.ExpiresAt.UTC().Format("2006-01-02T15:04:05Z"),
	}, "\n")
	mac := hmac.New(sha256.New, secret)
	mac.Write([]byte(lines))
	return hex.EncodeToString(mac.Sum(nil))
}

// InstructionSecretContext is what the instruction secret is worked out for, on both sides of the wire.
const InstructionSecretContext = "journal host protocol 1 instructions"

// InstructionSecretOf is the secret the journal signs this host's instructions with, worked out from the host's credential the
// way the journal works it out (App\Models\Projects\Host::instructionSecretOf), so enrolment hands over nothing more.
func InstructionSecretOf(credential string) []byte {
	mac := hmac.New(sha256.New, []byte(credential))
	mac.Write([]byte(InstructionSecretContext))
	return []byte(hex.EncodeToString(mac.Sum(nil)))
}
