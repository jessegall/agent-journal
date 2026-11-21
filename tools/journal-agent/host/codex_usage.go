package host

import (
	"encoding/json"
	"time"

	"journal-agent/client"
)

// CodexUsage takes what a Codex app-server reported of an account's usage: its limit windows and the latest token
// count of a thread.
type CodexUsage interface {
	Window(reading WindowReading)
	ThreadTokens(count ThreadCount)
}

// codexLimitID is the limit of Codex itself among the limits an app-server reports.
const codexLimitID = "codex"

// codexRateLimits is the answer of account/rateLimits/read and the params of account/rateLimits/updated: the
// snapshot of one limit, and the snapshot of each limit by its id.
type codexRateLimits struct {
	RateLimits *codexLimitSnapshot           `json:"rateLimits"`
	ByLimitID  map[string]codexLimitSnapshot `json:"rateLimitsByLimitId"`
}

// codexLimitSnapshot is one limit's primary and secondary windows, each optional and independent.
type codexLimitSnapshot struct {
	LimitID   *string           `json:"limitId"`
	Primary   *codexLimitWindow `json:"primary"`
	Secondary *codexLimitWindow `json:"secondary"`
}

// codexLimitWindow is one window: its used percent, already from 0 to 100, and optionally its length in minutes and
// its reset in Unix seconds. Pointers keep an explicit zero apart from a missing value.
type codexLimitWindow struct {
	UsedPercent        *json.Number `json:"usedPercent"`
	WindowDurationMins *int         `json:"windowDurationMins"`
	ResetsAt           *int64       `json:"resetsAt"`
}

// readCodexWindows decodes the windows of Codex's own limit from a rate-limit answer or notification; any other
// limit's are never read.
func readCodexWindows(params json.RawMessage) []WindowReading {
	var limits codexRateLimits
	if json.Unmarshal(params, &limits) != nil {
		return nil
	}
	snapshot, found := limits.codexSnapshot()
	if !found {
		return nil
	}
	var readings []WindowReading
	for _, each := range []struct {
		slot   string
		window *codexLimitWindow
	}{{client.WindowPrimary, snapshot.Primary}, {client.WindowSecondary, snapshot.Secondary}} {
		reading, ok := each.window.reading(each.slot)
		if !ok {
			continue
		}
		readings = append(readings, reading)
	}
	return readings
}

// codexSnapshot is the Codex entry of the map by limit id, or else the single snapshot when it is Codex's.
func (limits codexRateLimits) codexSnapshot() (codexLimitSnapshot, bool) {
	if snapshot, found := limits.ByLimitID[codexLimitID]; found {
		return snapshot, true
	}
	if limits.RateLimits == nil {
		return codexLimitSnapshot{}, false
	}
	if limits.RateLimits.LimitID != nil && *limits.RateLimits.LimitID != codexLimitID {
		return codexLimitSnapshot{}, false
	}
	return *limits.RateLimits, true
}

func (window *codexLimitWindow) reading(slot string) (WindowReading, bool) {
	if window == nil || window.UsedPercent == nil {
		return WindowReading{}, false
	}
	percent, err := window.UsedPercent.Float64()
	if err != nil || percent < 0 || percent > 100 {
		return WindowReading{}, false
	}
	reading := WindowReading{LimitID: codexLimitID, Slot: slot, UsedPercent: &percent,
		WindowMinutes: window.WindowDurationMins}
	if window.ResetsAt != nil {
		reset := time.Unix(*window.ResetsAt, 0).UTC()
		reading.ResetsAt = &reset
	}
	return reading, true
}

// codexTokenUsage is the params of thread/tokenUsage/updated: the thread, its total so far and its last turn.
type codexTokenUsage struct {
	ThreadID   string `json:"threadId"`
	TokenUsage struct {
		Total *codexTokens `json:"total"`
		Last  *codexTokens `json:"last"`
	} `json:"tokenUsage"`
}

// codexTokens is one token breakdown; its parts overlap, so only its own total is a total.
type codexTokens struct {
	TotalTokens           *int64 `json:"totalTokens"`
	InputTokens           *int64 `json:"inputTokens"`
	CachedInputTokens     *int64 `json:"cachedInputTokens"`
	OutputTokens          *int64 `json:"outputTokens"`
	ReasoningOutputTokens *int64 `json:"reasoningOutputTokens"`
}

// readCodexThreadCount decodes a thread's token count; one without its total gives none.
func readCodexThreadCount(params json.RawMessage) (ThreadCount, bool) {
	var usage codexTokenUsage
	if json.Unmarshal(params, &usage) != nil || usage.ThreadID == "" {
		return ThreadCount{}, false
	}
	total := usage.TokenUsage.Total
	if total == nil || total.TotalTokens == nil {
		return ThreadCount{}, false
	}
	count := ThreadCount{ThreadID: usage.ThreadID, Total: *total.TotalTokens, Input: total.InputTokens,
		CachedInput: total.CachedInputTokens, Output: total.OutputTokens, ReasoningOutput: total.ReasoningOutputTokens}
	if last := usage.TokenUsage.Last; last != nil {
		count.LastTurnTotal = last.TotalTokens
	}
	return count, true
}
