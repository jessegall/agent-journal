package client

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"time"
)

// HookReply is the journal's answer to one native hook call, as the provider reads it back: the hook's standard
// output, standard error and exit code (App\Support\Drivers\DriverReplyData).
type HookReply struct {
	Stdout   string `json:"stdout"`
	Stderr   string `json:"stderr"`
	ExitCode int    `json:"exitCode"`
}

// ErrHookReplyMalformed is returned for an answer that is not the journal's reply to a hook.
var ErrHookReplyMalformed = errors.New("the journal's answer is no hook reply")

// hookReplyLimit is the most of an answer that is read: a reply carries context for the driver, never a file.
const hookReplyLimit = 4 << 20

// HookCall is one native hook call prepared for the journal under its own call id and issue time, so a second send
// after a failed one reaches the journal as the same call (App\Support\Relay\HookRelay::send).
type HookCall struct {
	grant    StartGrant
	target   string
	body     []byte
	callID   string
	issuedAt int64
}

// PrepareHookCall prepares the native call of a driver's hook for the journal: POST /hooks/{driver}, with the
// process generation as its query when the start names one (App\Support\Relay\RelaySettings::hookPath).
func (grant StartGrant) PrepareHookCall(driver string, generation int, native []byte) (HookCall, error) {
	callID, err := newCallID()
	if err != nil {
		return HookCall{}, err
	}
	target := "/hooks/" + url.PathEscape(driver)
	if generation > 0 {
		target += "?generation=" + strconv.Itoa(generation)
	}

	return HookCall{grant: grant, target: target, body: native, callID: callID, issuedAt: time.Now().Unix()}, nil
}

// Send posts the call, signed as the start's agent, and answers the journal's reply. Any status but a success and
// any body that is no reply is an error: the caller then gives the provider its own blocking reply.
func (call HookCall) Send(ctx context.Context) (HookReply, error) {
	request, err := call.grant.signedRequest(ctx, call.target, call.body, call.callID, call.issuedAt)
	if err != nil {
		return HookReply{}, err
	}
	response, err := directClient.Do(request)
	if err != nil {
		return HookReply{}, sendFailure(err)
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		message, _ := io.ReadAll(io.LimitReader(response.Body, 512))

		return HookReply{}, errors.Join(ErrRefused,
			fmt.Errorf("the journal answered %d to %s: %s", response.StatusCode, call.target, message))
	}

	content, err := io.ReadAll(io.LimitReader(response.Body, hookReplyLimit))
	if err != nil {
		return HookReply{}, errors.Join(ErrUncertain, err)
	}
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(content, &fields); err != nil {
		return HookReply{}, errors.Join(ErrHookReplyMalformed, err)
	}
	for _, name := range []string{"stdout", "stderr", "exitCode"} {
		if _, present := fields[name]; !present {
			return HookReply{}, fmt.Errorf("%w: it has no %s", ErrHookReplyMalformed, name)
		}
	}
	var reply HookReply
	if err := json.Unmarshal(content, &reply); err != nil {
		return HookReply{}, errors.Join(ErrHookReplyMalformed, err)
	}

	return reply, nil
}

// directClient sends a started driver's own calls: it follows no redirect, so a signed call never reaches another
// address than the one it signed, and it takes the proxy of its environment, as a session container reaches the
// journal through the egress proxy.
var directClient = &http.Client{
	CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse },
}

// signedRequest is a POST of the content as JSON, signed as the grant's agent under the call id and issue time
// given: the envelope with the start's profile key and revision after it
// (App\Support\SignedCall::agentSignatureFor, App\Support\PreparedAgentCall::headers).
func (grant StartGrant) signedRequest(
	ctx context.Context,
	target string,
	content []byte,
	callID string,
	issuedAt int64,
) (*http.Request, error) {
	signed, err := signature(grant.Token, http.MethodPost, target, callID, issuedAt, content, grant.ProfileKey,
		strconv.Itoa(grant.ProfileRevision))
	if err != nil {
		return nil, err
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodPost, grant.JournalURL+target, bytes.NewReader(content))
	if err != nil {
		return nil, err
	}
	request.Header.Set("Authorization", "Bearer "+grant.Token)
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Accept", "application/json")
	request.Header.Set(callIDHeader, callID)
	request.Header.Set(issuedAtHeader, strconv.FormatInt(issuedAt, 10))
	request.Header.Set(signatureHeader, signed)
	request.Header.Set(profileHeader, grant.ProfileKey)
	request.Header.Set(profileRevisionHeader, strconv.Itoa(grant.ProfileRevision))

	return request, nil
}
