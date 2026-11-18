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
	protocolVersion = "2"
	callIDHeader    = "X-Journal-Call-Id"
	issuedAtHeader  = "X-Journal-Call-Issued-At"
	signatureHeader = "X-Journal-Call-Signature"
	protocolHeader  = "X-Journal-Protocol"
)

var errLineBreak = errors.New("a signed field holds a line break")

// signature is the HMAC-SHA256, keyed by the secret, of the protocol, method, request target, call id, issue time and
// body digest, one per line.
func signature(secret, method, target, callID string, issuedAt int64, body []byte) (string, error) {
	digest := sha256.Sum256(body)
	fields := []string{protocolVersion, strings.ToUpper(method), target, callID, strconv.FormatInt(issuedAt, 10), hex.EncodeToString(digest[:])}
	for _, field := range fields {
		if strings.ContainsAny(field, "\r\n") {
			return "", errLineBreak
		}
	}
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(strings.Join(fields, "\n")))
	return hex.EncodeToString(mac.Sum(nil)), nil
}
