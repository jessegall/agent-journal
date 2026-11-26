package hookadapter

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"os"
	"strings"
	"time"
)

// ErrRepliesUnsealed is a reply file that is missing, unreadable, or whose seal does not hold under its key.
var ErrRepliesUnsealed = errors.New("the hook reply file is missing or its seal does not hold")

// sealedFile is the reply file as the journal writes it: the body's JSON text and its seal.
type sealedFile struct {
	Body string `json:"body"`
	Seal string `json:"seal"`
}

// Replies is the body of a start's sealed reply file: which events the journal answers, which are guarded tool
// calls, which tools start a native child, how long a call waits for the journal, and the reply to each event for
// each reason the hook answers alone.
type Replies struct {
	Events       []string                    `json:"events"`
	ToolEvents   []string                    `json:"toolEvents"`
	SpawnTools   []string                    `json:"spawnTools"`
	BudgetMs     int                         `json:"budgetMs"`
	Retries      int                         `json:"retries"`
	UnknownEvent Reply                       `json:"unknownEvent"`
	Answers      map[string]map[string]Reply `json:"replies"`
}

// The reasons the hook answers from the file instead of the journal.
const (
	reasonAway       = "away"
	reasonUnprepared = "unprepared"
	reasonSpawn      = "spawn"
)

// LoadReplies reads the reply file at the path and the key file beside it, and answers its body only when the seal
// holds: a hex HMAC-SHA256 of the body's bytes under the key.
func LoadReplies(path string) (Replies, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		return Replies{}, errors.Join(ErrRepliesUnsealed, err)
	}
	key, err := os.ReadFile(strings.TrimSuffix(path, ".json") + ".key")
	if err != nil {
		return Replies{}, errors.Join(ErrRepliesUnsealed, err)
	}
	var file sealedFile
	if err := json.Unmarshal(content, &file); err != nil {
		return Replies{}, errors.Join(ErrRepliesUnsealed, err)
	}
	if !hmac.Equal([]byte(sealOf(file.Body, key)), []byte(file.Seal)) {
		return Replies{}, ErrRepliesUnsealed
	}
	var replies Replies
	if err := json.Unmarshal([]byte(file.Body), &replies); err != nil {
		return Replies{}, errors.Join(ErrRepliesUnsealed, err)
	}

	return replies, nil
}

func sealOf(body string, key []byte) string {
	mac := hmac.New(sha256.New, key)
	mac.Write([]byte(body))

	return hex.EncodeToString(mac.Sum(nil))
}

// budget is the longest a call waits for the journal, its retries included.
func (replies Replies) budget() time.Duration {
	return time.Duration(replies.BudgetMs) * time.Millisecond
}

// answer is the file's reply to the event for the reason; an event the file holds no reply for gets an empty one.
func (replies Replies) answer(reason string, event string) Reply {
	return replies.Answers[reason][event]
}
