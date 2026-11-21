package release

import (
	"crypto/ed25519"
	"encoding/base64"
	"errors"
)

// pinnedPublicKey is the base64 of the ed25519 public key a release is signed with. journal-release sets it in
// every program it builds (go build -ldflags -X), so an installed journal-agent verifies the releases after it.
var pinnedPublicKey string

// ErrNoPinnedKey is returned by a journal-agent built without a pinned release key, such as a development build.
var ErrNoPinnedKey = errors.New("this journal-agent was built without a pinned release key")

// PinnedPublicKey is the release key this program was built with.
func PinnedPublicKey() (ed25519.PublicKey, error) {
	if pinnedPublicKey == "" {
		return nil, ErrNoPinnedKey
	}

	key, err := base64.StdEncoding.DecodeString(pinnedPublicKey)
	if err != nil || len(key) != ed25519.PublicKeySize {
		return nil, ErrNoPinnedKey
	}

	return ed25519.PublicKey(key), nil
}

// pinnedKeyFlag is the linker flag that pins the key in a program being built.
func pinnedKeyFlag(key ed25519.PublicKey) string {
	return "-X journal-agent/release.pinnedPublicKey=" + base64.StdEncoding.EncodeToString(key)
}
