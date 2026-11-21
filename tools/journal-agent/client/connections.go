package client

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
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
	Protocol          int    `json:"protocol"`
}

// Redemption is what redeeming an install line made: the host, project and binding, and, from a redemption, the
// protocol and the canonical origin the relay talks to from then on.
type Redemption struct {
	HostID          string `json:"hostId"`
	ProjectID       string `json:"projectId"`
	BindingID       string `json:"bindingId"`
	Protocol        int    `json:"protocol"`
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
