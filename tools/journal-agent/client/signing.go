package client

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"strconv"
	"strings"
)

// The signed envelope the journal's AuthenticateHost middleware reads (App\AgentRequests\Support\SignedCall).
const (
	callIDHeader    = "X-Journal-Call-Id"
	issuedAtHeader  = "X-Journal-Call-Issued-At"
	signatureHeader = "X-Journal-Call-Signature"
)

var errLineBreak = errors.New("a signed field holds a line break")

// signature is the HMAC-SHA256, keyed by the secret, of the method, request target, call id, issue time and body
// digest, one per line, then any extra fields such as an agent call's profile key and revision
// (App\Support\SignedCall::envelope).
func signature(secret, method, target, callID string, issuedAt int64, body []byte, extra ...string) (string, error) {
	digest := sha256.Sum256(body)
	fields := append([]string{strings.ToUpper(method), target, callID, strconv.FormatInt(issuedAt, 10), hex.EncodeToString(digest[:])}, extra...)
	for _, field := range fields {
		if strings.ContainsAny(field, "\r\n") {
			return "", errLineBreak
		}
	}
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(strings.Join(fields, "\n")))
	return hex.EncodeToString(mac.Sum(nil)), nil
}
