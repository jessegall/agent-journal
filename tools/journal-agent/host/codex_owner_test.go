package host

import (
	"bufio"
	"context"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"testing"
	"time"
)

// TestMain lets the test binary stand in for the Codex app-server when a test starts it as one.
// serveFakeAppServer answers the owner's requests as Codex 0.165.0's app-server would, notes each method it heard in
// FAKE_REQUESTS, and after each turn/start sends the FAKE_AFTER_TURN notifications with {thread} as the thread.
func serveFakeAppServer() {
	heard, _ := os.OpenFile(os.Getenv("FAKE_REQUESTS"), os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o600)
	defer heard.Close()
	threads := 0
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		var request struct {
			ID     *int            `json:"id"`
			Method string          `json:"method"`
			Params json.RawMessage `json:"params"`
		}
		if json.Unmarshal(scanner.Bytes(), &request) != nil {
			continue
		}
		_, _ = heard.WriteString(request.Method + "\n")
		if request.ID == nil {
			continue
		}
		result := "{}"
		var after []string
		switch request.Method {
		case "account/read":
			result = `{"account":{"type":"` + os.Getenv("FAKE_ACCOUNT") + `"}}`
		case "account/rateLimits/read":
			if os.Getenv("FAKE_LIMITS") == "hang" {
				continue
			}
			result = os.Getenv("FAKE_LIMITS")
		case "thread/start":
			threads++
			result = `{"thread":{"id":"thread-` + strconv.Itoa(threads) + `"}}`
		case "turn/start":
			var params struct {
				ThreadID string `json:"threadId"`
			}
			_ = json.Unmarshal(request.Params, &params)
			result = `{"turn":{"id":"turn-` + params.ThreadID + `"}}`
			for _, line := range strings.Split(os.Getenv("FAKE_AFTER_TURN"), "\n") {
				if line != "" {
					after = append(after, strings.ReplaceAll(line, "{thread}", params.ThreadID))
				}
			}
			after = append(after, `{"method":"turn/completed","params":{"threadId":"`+params.ThreadID+
				`","turn":{"id":"turn-`+params.ThreadID+`","status":"completed"}}}`)
		}
		answer, _ := json.Marshal(map[string]any{"id": *request.ID, "result": json.RawMessage(result)})
		os.Stdout.Write(append(answer, '\n'))
		for _, line := range after {
			os.Stdout.WriteString(line + "\n")
		}
	}
}

type fakeServer struct {
	account, limits, afterTurn string
}

func startFakeOwner(t *testing.T, server fakeServer, method string) (*CodexOwner, string, error) {
	t.Helper()
	requests := filepath.Join(t.TempDir(), "requests")
	executable, err := os.Executable()
	if err != nil {
		t.Fatal(err)
	}
	environment := append(os.Environ(), "FAKE_CODEX_APP_SERVER=1", "FAKE_REQUESTS="+requests,
		"FAKE_ACCOUNT="+server.account, "FAKE_LIMITS="+server.limits, "FAKE_AFTER_TURN="+server.afterTurn)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	owner, err := StartCodexOwner(ctx, executable, environment, t.TempDir(), method)
	if owner != nil {
		t.Cleanup(owner.Stop)
	}
	return owner, requests, err
}

func requestCounts(t *testing.T, requests string) map[string]int {
	t.Helper()
	content, _ := os.ReadFile(requests)
	counts := map[string]int{}
	for _, method := range strings.Fields(string(content)) {
		counts[method]++
	}
	return counts
}

type seenUsage struct {
	windows chan WindowReading
	counts  chan ThreadCount
}

func newSeenUsage() seenUsage {
	return seenUsage{windows: make(chan WindowReading, 16), counts: make(chan ThreadCount, 16)}
}

func (seen seenUsage) Window(reading WindowReading) { seen.windows <- reading }

func (seen seenUsage) ThreadTokens(count ThreadCount) { seen.counts <- count }

func nextWindow(t *testing.T, seen seenUsage) WindowReading {
	t.Helper()
	select {
	case reading := <-seen.windows:
		return reading
	case <-time.After(3 * time.Second):
		t.Fatal("no window was reported")
		return WindowReading{}
	}
}

func nextCount(t *testing.T, seen seenUsage) ThreadCount {
	t.Helper()
	select {
	case count := <-seen.counts:
		return count
	case <-time.After(3 * time.Second):
		t.Fatal("no thread count was reported")
		return ThreadCount{}
	}
}

func runTurn(t *testing.T, owner *CodexOwner, usage CodexUsage) string {
	t.Helper()
	ctx := context.Background()
	thread, err := owner.StartThread(ctx, CodexThreadSettings{Root: t.TempDir(), Usage: usage})
	if err != nil {
		t.Fatal(err)
	}
	if _, err := owner.StartTurn(ctx, thread, "hi", "", nil); err != nil {
		t.Fatal(err)
	}
	select {
	case end := <-owner.TurnEnds(thread):
		if end.Status != "completed" {
			t.Fatalf("the turn of %s ended %+v", thread, end)
		}
	case <-time.After(3 * time.Second):
		t.Fatalf("the turn of %s never ended", thread)
	}
	return thread
}

const multiLimitAnswer = `{"rateLimits":{"limitId":"other","primary":{"usedPercent":99}},"rateLimitsByLimitId":{` +
	`"other":{"primary":{"usedPercent":99}},` +
	`"codex":{"primary":{"usedPercent":12.5,"windowDurationMins":300,"resetsAt":1764000000},"secondary":{"usedPercent":0}}}}`

func TestAChatgptOwnerSharedByTwoThreadsReadsItsLimitsOnceAndOnlyCodexs(t *testing.T) {
	owner, requests, err := startFakeOwner(t, fakeServer{account: "chatgpt", limits: multiLimitAnswer}, "oauth")
	if err != nil {
		t.Fatal(err)
	}
	usage := newSeenUsage()
	owner.ReportWindowsTo(usage)
	primary, secondary := nextWindow(t, usage), nextWindow(t, usage)
	owner.ReportWindowsTo(usage)

	runTurn(t, owner, usage)
	runTurn(t, owner, usage)

	if primary.Slot != "primary" || *primary.UsedPercent != 12.5 || *primary.WindowMinutes != 300 ||
		primary.ResetsAt.Unix() != 1764000000 || primary.LimitID != "codex" {
		t.Fatalf("primary %+v", primary)
	}
	if secondary.Slot != "secondary" || *secondary.UsedPercent != 0 || secondary.ResetsAt != nil {
		t.Fatalf("secondary %+v", secondary)
	}
	counts := requestCounts(t, requests)
	if counts["initialize"] != 1 || counts["account/rateLimits/read"] != 1 || counts["thread/start"] != 2 ||
		counts["turn/start"] != 2 {
		t.Fatalf("requests %v", counts)
	}
	select {
	case reading := <-usage.windows:
		t.Fatalf("another limit was reported: %+v", reading)
	default:
	}
}

func TestALimitNotificationGivesANewWindow(t *testing.T) {
	update := `{"method":"account/rateLimits/updated","params":{"rateLimits":{"limitId":"codex",` +
		`"primary":{"usedPercent":55}}}}`
	owner, _, err := startFakeOwner(t, fakeServer{account: "chatgpt", limits: `{}`, afterTurn: update}, "oauth")
	if err != nil {
		t.Fatal(err)
	}
	usage := newSeenUsage()
	owner.ReportWindowsTo(usage)

	runTurn(t, owner, usage)

	if reading := nextWindow(t, usage); reading.Slot != "primary" || *reading.UsedPercent != 55 {
		t.Fatalf("the notification gave %+v", reading)
	}
}

func TestALimitReadThatTimesOutLeavesTheOwnerRunning(t *testing.T) {
	rateLimitsWait = 200 * time.Millisecond
	t.Cleanup(func() { rateLimitsWait = 10 * time.Second })
	owner, requests, err := startFakeOwner(t, fakeServer{account: "chatgpt", limits: "hang"}, "oauth")
	if err != nil {
		t.Fatal(err)
	}
	owner.ReportWindowsTo(newSeenUsage())
	time.Sleep(400 * time.Millisecond)

	runTurn(t, owner, nil)

	if hasEnded(owner) {
		t.Fatal("a limit read that timed out ended the owner")
	}
	time.Sleep(100 * time.Millisecond)
	if counts := requestCounts(t, requests); counts["account/rateLimits/read"] != 2 {
		t.Fatalf("the failed read was not asked once more on the next activity: %v", counts)
	}
}

func TestAnApiKeyOwnerReadsNoLimitsAndReplacesAKnownThreadsCount(t *testing.T) {
	updates := `{"method":"thread/tokenUsage/updated","params":{"threadId":"{thread}","tokenUsage":{` +
		`"total":{"totalTokens":100,"inputTokens":80,"cachedInputTokens":20,"outputTokens":20},"last":{"totalTokens":100}}}}` +
		"\n" + `{"method":"thread/tokenUsage/updated","params":{"threadId":"{thread}","tokenUsage":{` +
		`"total":{"totalTokens":250,"inputTokens":200,"outputTokens":50},"last":{"totalTokens":150}}}}` +
		"\n" + `{"method":"thread/tokenUsage/updated","params":{"threadId":"thread-unknown","tokenUsage":{` +
		`"total":{"totalTokens":9}}}}`
	owner, requests, err := startFakeOwner(t, fakeServer{account: "apiKey", afterTurn: updates}, "api_key")
	if err != nil {
		t.Fatal(err)
	}
	usage := newSeenUsage()
	owner.ReportWindowsTo(usage)

	thread := runTurn(t, owner, usage)

	first, second := nextCount(t, usage), nextCount(t, usage)
	if first.ThreadID != thread || first.Total != 100 || *first.CachedInput != 20 || *first.LastTurnTotal != 100 {
		t.Fatalf("first %+v", first)
	}
	if second.Total != 250 || second.CachedInput != nil || *second.LastTurnTotal != 150 {
		t.Fatalf("second %+v", second)
	}
	select {
	case count := <-usage.counts:
		t.Fatalf("an unknown thread's count was reported: %+v", count)
	case <-time.After(200 * time.Millisecond):
	}
	if counts := requestCounts(t, requests); counts["account/rateLimits/read"] != 0 {
		t.Fatalf("an API-key owner asked for limits: %v", counts)
	}
}

func TestAnOwnerWhoseAccountIsNotOfTheClaimsMethodIsRefused(t *testing.T) {
	if _, _, err := startFakeOwner(t, fakeServer{account: "chatgpt"}, "api_key"); !errors.Is(err, ErrNotApiKeyAccount) {
		t.Fatalf("a ChatGPT account for an API-key claim answered %v", err)
	}
	if _, _, err := startFakeOwner(t, fakeServer{account: "apiKey"}, "oauth"); !errors.Is(err, ErrNotChatgptAccount) {
		t.Fatalf("an API-key account for an OAuth claim answered %v", err)
	}
}
