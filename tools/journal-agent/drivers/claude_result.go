package drivers

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"journal-agent/client"
	"journal-agent/drivers/contracts"
	"journal-agent/host"
	"math/big"
	"os/exec"
	"path/filepath"
	"slices"
	"time"
)

// ErrNotSignedIn refuses a Claude account start whose account is not signed in to claude.ai in its own folder: it
// never falls back to another sign-in or an API key.
var ErrNotSignedIn = errors.New("the Claude account is not signed in to claude.ai in its own folder")

// claudeAuthStatus is what `claude auth status --json` of 2.1.323 answers (docs/accounts/claude-integration.md).
type claudeAuthStatus struct {
	LoggedIn        bool   `json:"loggedIn"`
	AuthMethod      string `json:"authMethod"`
	ConfigDirectory string `json:"configDirectory"`
}

// CheckClaudeSignIn asks the protected executable, in the start's own environment and with the files it reads,
// whether the account is signed in by one of the methods the journal accepts, in exactly its folder. Nothing it prints is kept
// beyond those three fields.
func CheckClaudeSignIn(
	ctx context.Context,
	executable string,
	environment []string,
	readFiles []string,
	accountFolder string,
	methods []string,
) error {
	command := exec.CommandContext(ctx, executable, "auth", "status", "--json")
	command.Env = environment
	files, err := host.OpenReadFiles(readFiles)
	if err != nil {
		return errors.Join(ErrNotSignedIn, err)
	}
	defer host.CloseFiles(files)
	command.ExtraFiles = files
	output, err := command.Output()
	if err != nil && len(output) == 0 {
		return errors.Join(ErrNotSignedIn, err)
	}
	var status claudeAuthStatus
	if err := json.Unmarshal(output, &status); err != nil {
		return errors.Join(ErrNotSignedIn, err)
	}
	if !status.isSignedInAt(accountFolder, methods) {
		return ErrNotSignedIn
	}
	return nil
}

// isSignedInAt is whether the status is a sign-in by one of the methods the journal accepts, kept in the account's own
// folder.
func (status claudeAuthStatus) isSignedInAt(accountFolder string, methods []string) bool {
	return status.LoggedIn && slices.Contains(methods, status.AuthMethod) &&
		filepath.Clean(status.ConfigDirectory) == filepath.Clean(accountFolder)
}

// claudeResult is the last result line of a stream-json turn.
type claudeResult struct {
	Type      string `json:"type"`
	Subtype   string `json:"subtype"`
	IsError   bool   `json:"is_error"`
	SessionID string `json:"session_id"`
}

// UsageObserver takes the usage a start's program reported as it is read: a limit window, or one result's cost.
type UsageObserver interface {
	Window(reading host.WindowReading)
	ResultCost(resultID, usd string)
}

// ignoredUsage is the observer of a start whose usage nobody reads.
type ignoredUsage struct{}

func (ignoredUsage) Window(host.WindowReading) {}

func (ignoredUsage) ResultCost(string, string) {}

// claudeLine is one stream-json line as far as the turn's answer and its usage need it; nothing else is decoded.
type claudeLine struct {
	claudeResult
	UUID          string                      `json:"uuid"`
	Model         string                      `json:"model"`
	ModelUsage    map[string]claudeModelUsage `json:"model_usage_since_last_result"`
	RateLimitInfo *claudeRateLimitInfo        `json:"rate_limit_info"`
}

// claudeModelUsage is one model's usage since the previous result; only its cost is read.
type claudeModelUsage struct {
	CostUSD *json.Number `json:"costUSD"`
}

// claudeRateLimitInfo is a rate_limit_event's information: the unified windows, or one named limit.
type claudeRateLimitInfo struct {
	UnifiedWindows *struct {
		FiveHour *claudeStreamWindow `json:"five_hour"`
		SevenDay *claudeStreamWindow `json:"seven_day"`
	} `json:"unifiedWindows"`
	RateLimitType string `json:"rateLimitType"`
	claudeStreamWindow
}

// claudeStreamWindow is one window of a rate_limit_event; pointers keep an explicit zero apart from a missing value.
type claudeStreamWindow struct {
	Utilization *json.Number `json:"utilization"`
	ResetsAt    *int64       `json:"resetsAt"`
}

// claudeLimitID is the limit every Claude window belongs to.
const claudeLimitID = "claude"

// mostCostDecimals is how many decimals of US dollars a cost keeps, as many as the journal accepts.
const mostCostDecimals = 12

// readClaudeResult reads a turn's stream-json output to its end, hands each limit window and each result's cost to
// the observer as it is read, and tells the last result's subtype and error flag, or that none came, for the journal
// to judge. A result without its own uuid is named by its process generation and its place in that process's output.
// The output itself is not kept.
func readClaudeResult(output io.Reader, usage UsageObserver, process int) contracts.TurnEnd {
	scanner := bufio.NewScanner(output)
	scanner.Buffer(make([]byte, 64*1024), 16*1024*1024)
	var last *claudeResult
	results, model := 0, ""
	for scanner.Scan() {
		var line claudeLine
		if json.Unmarshal(scanner.Bytes(), &line) != nil {
			continue
		}
		switch line.Type {
		case "rate_limit_event":
			observeWindows(line.RateLimitInfo, usage)
		case "system":
			if line.Subtype == "init" && line.Model != "" {
				model = line.Model
			}
		case "result":
			results++
			result := line.claudeResult
			last = &result
			observeCost(line, fmt.Sprintf("process-%d-result-%d", process, results), usage)
		}
	}
	end := contracts.TurnEnd{Model: model}
	if err := scanner.Err(); err != nil {
		// The rest is read and dropped, so the program never waits on a full pipe.
		_, _ = io.Copy(io.Discard, output)
		end.Problem = err.Error()
	}
	if last != nil {
		end.ResultRead, end.ResultSubtype, end.ResultIsError = true, last.Subtype, last.IsError
	}
	return end
}

// observeWindows hands each measured window of the event on, each on its own, so a malformed window never drops its
// valid sibling; an event of overall status only gives nothing.
func observeWindows(info *claudeRateLimitInfo, usage UsageObserver) {
	if info == nil {
		return
	}
	if info.UnifiedWindows == nil {
		observeWindow(info.RateLimitType, &info.claudeStreamWindow, usage)
		return
	}
	observeWindow(client.WindowFiveHour, info.UnifiedWindows.FiveHour, usage)
	observeWindow(client.WindowSevenDay, info.UnifiedWindows.SevenDay, usage)
}

// observeWindow hands on one window of a known slot with a utilization from 0 to 1, as a percent; the reset, in Unix
// seconds, only when it was reported.
func observeWindow(slot string, window *claudeStreamWindow, usage UsageObserver) {
	if slot != client.WindowFiveHour && slot != client.WindowSevenDay {
		return
	}
	if window == nil || window.Utilization == nil {
		return
	}
	fraction, err := window.Utilization.Float64()
	if err != nil || fraction < 0 || fraction > 1 {
		return
	}
	percent := fraction * 100
	reading := host.WindowReading{LimitID: claudeLimitID, Slot: slot, UsedPercent: &percent}
	if window.ResetsAt != nil {
		reset := time.Unix(*window.ResetsAt, 0).UTC()
		reading.ResetsAt = &reset
	}
	usage.Window(reading)
}

// observeCost hands on the exact sum of the models' costs since the previous result, once for the result; a result
// without that map, with an empty one or with any cost that is not a nonnegative number gives none. The cumulative
// total_cost_usd is never read.
func observeCost(line claudeLine, fallbackID string, usage UsageObserver) {
	if len(line.ModelUsage) == 0 {
		return
	}
	sum := new(big.Rat)
	for _, model := range line.ModelUsage {
		cost, ok := exactCost(model.CostUSD)
		if !ok {
			return
		}
		sum.Add(sum, cost)
	}
	resultID := line.UUID
	if resultID == "" {
		resultID = fallbackID
	}
	usage.ResultCost(resultID, sum.FloatString(mostCostDecimals))
}

func exactCost(cost *json.Number) (*big.Rat, bool) {
	if cost == nil {
		return nil, false
	}
	value, ok := new(big.Rat).SetString(cost.String())
	if !ok || value.Sign() < 0 {
		return nil, false
	}
	return value, true
}
