package hostapi

import (
	"errors"
	"net"
	"net/url"
)

// ErrInsecureOrigin is a journal a remote host would reach over plain http: its instructions and keys could be read and
// altered on the way.
var ErrInsecureOrigin = errors.New("a remote host speaks to its journal over https only")

// CheckOrigin refuses a journal a host reaches over plain http, unless it runs on this machine: in the host's own
// compose network, as a contained host does, or on a loopback address.
func CheckOrigin(journalURL string, isContained bool) error {
	origin, err := url.Parse(journalURL)
	if err != nil {
		return err
	}
	if origin.Scheme == "https" || isContained {
		return nil
	}
	if origin.Hostname() == "localhost" {
		return nil
	}
	if address := net.ParseIP(origin.Hostname()); address != nil && address.IsLoopback() {
		return nil
	}
	return ErrInsecureOrigin
}
