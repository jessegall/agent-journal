package client

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"time"
)

// RedeemRequest mirrors App\Http\Requests\Connections\RedeemProjectInvitationRequest: an install line's ticket, the
// credential this relay's host will sign with and the folder it connects.
type RedeemRequest struct {
	Ticket            string `json:"ticket"`
	InstallationNonce string `json:"installationNonce"`
	HostCredential    string `json:"hostCredential"`
	RootID            string `json:"rootId"`
	CanonicalRoot     string `json:"canonicalRoot"`
	ProjectLabel      string `json:"projectLabel"`
	MachineLabel      string `json:"machineLabel"`
}

// Redemption is what redeeming an install line made: the host, project and binding, and, from a redemption, the
// canonical origin the relay talks to from then on.
type Redemption struct {
	HostID          string `json:"hostId"`
	ProjectID       string `json:"projectId"`
	BindingID       string `json:"bindingId"`
	MainAgentID     string `json:"mainAgentId"`
	ProjectLabel    string `json:"projectLabel"`
	CanonicalOrigin string `json:"canonicalOrigin"`
}

const (
	redeemTarget  = "/api/project-connections/redeem"
	recoverTarget = "/api/project-connections/recover"
)

// Redeem spends an install line once. It is the one call a relay makes before it has a host, so it is not signed;
// the ticket is its authority. A reply that never arrives is ErrUncertain: recover with the same credential and nonce.
func Redeem(ctx context.Context, transport *http.Client, origin string, request RedeemRequest) (Redemption, error) {
	content, err := json.Marshal(request)
	if err != nil {
		return Redemption{}, err
	}

	answer := Redemption{}
	if err := post(ctx, transport, origin+redeemTarget, content, &answer); err != nil {
		return Redemption{}, err
	}

	return answer, nil
}

// Recover asks, signed with the credential the redemption staged, for the binding this installation nonce made.
func (client *Client) Recover(ctx context.Context, installationNonce string) (Redemption, error) {
	answer := Redemption{}
	err := client.call(ctx, recoverTarget, map[string]string{"installationNonce": installationNonce}, &answer)

	return answer, err
}

// PresenceReport mirrors App\Http\Data\Connections\PresenceReportData: the boot of the relay, its rising sequence,
// the release it runs, how setting up the folder ended and whether it takes
// over a live boot.
type PresenceReport struct {
	BootID       string `json:"bootId"`
	Sequence     int    `json:"sequence"`
	Release      string `json:"release"`
	Provisioning string `json:"provisioning"`
	IsTakeover   bool   `json:"isTakeover"`
	// SetupGeneration is the folder's setup generation, which rises on every setup or resume of it.
	SetupGeneration int `json:"setupGeneration"`
	// IsReconciled is whether this boot already reported what became of its earlier sessions: until it did, the
	// journal starts nothing and runs no command for the binding.
	IsReconciled bool `json:"isReconciled"`
}

// NotifyRuntimeStopped gives the journal the device's receipt that the runtime's session stopped; sent again, it
// changes nothing.
func (client *Client) NotifyRuntimeStopped(ctx context.Context, bindingID string, runtimeID string) error {
	return client.call(ctx, "/host/bindings/"+url.PathEscape(bindingID)+"/runtimes/"+url.PathEscape(runtimeID)+"/stopped",
		nil, nil)
}

// PresenceReceipt is the journal's answer to a presence report: the binding, the boot generation it holds, the setup
// generation it acknowledged, the server's time, when the presence expires, and the binding's authority generation
// every lease renewal carries.
type PresenceReceipt struct {
	BindingID           string    `json:"bindingId"`
	Generation          int       `json:"generation"`
	SetupGeneration     int       `json:"setupGeneration"`
	ServerTime          time.Time `json:"serverTime"`
	ExpiresAt           time.Time `json:"presenceExpiresAt"`
	AuthorityGeneration int       `json:"authorityGeneration"`
	// Readiness is where the journal holds the binding now: pending, ready, offline, incompatible or revoked.
	Readiness string `json:"readiness"`
}

// BindingStatus is what the journal holds of a binding now: its effective readiness, its last confirmed contact,
// zero when it never had one, and the server's time.
type BindingStatus struct {
	Readiness     string    `json:"readiness"`
	LastContactAt time.Time `json:"lastContactAt"`
	ServerTime    time.Time `json:"serverTime"`
}

// BindingStatus reads what the journal holds of the binding, signed by its host; it records no report.
func (client *Client) BindingStatus(ctx context.Context, bindingID string) (BindingStatus, error) {
	return answerOf[BindingStatus](ctx, client, "/host/bindings/"+url.PathEscape(bindingID)+"/status", nil)
}

// NotifyPresence tells the journal the binding's relay is present, with no provider session needed.
func (client *Client) NotifyPresence(ctx context.Context, bindingID string, report PresenceReport) (PresenceReceipt, error) {
	receipt := PresenceReceipt{}
	err := client.call(ctx, "/host/bindings/"+url.PathEscape(bindingID)+"/presence", report, &receipt)

	return receipt, err
}

// BindingRuntimeRequest mirrors App\Http\Data\Connections\BindingRuntimeRequestData.
type BindingRuntimeRequest struct {
	RootID  string `json:"rootId"`
	Folder  string `json:"folder"`
	AgentID string `json:"agentId"`
	Driver  string `json:"driver"`
	Profile string `json:"profile"`
	// Model is the model the session runs on; "default" asks for the profile's default.
	Model string `json:"model"`
	// StartID names this start before anything starts, so asking again after a lost reply opens nothing new.
	StartID string `json:"startId"`
}

// OpenedBindingRuntime is the session and runtime the journal opened for a binding's main agent, and the binding's
// authority generation its lease renewals carry.
type OpenedBindingRuntime struct {
	SessionID           string `json:"session_id"`
	RuntimeID           string `json:"runtime_id"`
	AuthorityGeneration int    `json:"authority_generation"`
	// Plan is the process the journal decided the owner's terminal runs, as an open order carries it.
	Plan json.RawMessage `json:"plan"`
}

// OpenBindingRuntime asks the journal to open the binding's main runtime in its own root.
func (client *Client) OpenBindingRuntime(
	ctx context.Context,
	bindingID string,
	request BindingRuntimeRequest,
) (OpenedBindingRuntime, error) {
	opened := OpenedBindingRuntime{}
	err := client.call(ctx, "/host/bindings/"+url.PathEscape(bindingID)+"/runtimes", request, &opened)

	return opened, err
}

// LeaseRenewal mirrors what App\Connections\Http\Controllers\RuntimeLeaseController reads: the binding's authority
// generation and the runtime's process generation the relay holds.
type LeaseRenewal struct {
	AuthorityGeneration int `json:"authorityGeneration"`
	RuntimeGeneration   int `json:"runtimeGeneration"`
}

// RuntimeLease is a renewed execution lease: the runtime and its generation, the server's time and when it ends.
type RuntimeLease struct {
	RuntimeID  string    `json:"runtimeId"`
	Generation int       `json:"generation"`
	ServerTime time.Time `json:"serverTime"`
	ExpiresAt  time.Time `json:"expiresAt"`
}

// RenewLease asks the journal for one more lease of a binding's runtime; a refusal is an error, never a lease.
func (client *Client) RenewLease(
	ctx context.Context,
	bindingID string,
	runtimeID string,
	renewal LeaseRenewal,
) (RuntimeLease, error) {
	lease := RuntimeLease{}
	target := "/host/bindings/" + url.PathEscape(bindingID) + "/runtimes/" + url.PathEscape(runtimeID) + "/lease"
	err := client.call(ctx, target, renewal, &lease)

	return lease, err
}

// post sends an unsigned JSON call and decodes its answer.
func post(ctx context.Context, transport *http.Client, url string, content []byte, answer any) error {
	request, err := newJSONRequest(ctx, url, content)
	if err != nil {
		return err
	}

	response, err := transport.Do(request)
	if err != nil {
		return errors.Join(ErrUncertain, err)
	}
	defer response.Body.Close()

	if err := refusalOf(response, redeemTarget); err != nil {
		return err
	}

	return json.NewDecoder(response.Body).Decode(answer)
}

func newJSONRequest(ctx context.Context, url string, content []byte) (*http.Request, error) {
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(content))
	if err != nil {
		return nil, err
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Accept", "application/json")

	return request, nil
}
