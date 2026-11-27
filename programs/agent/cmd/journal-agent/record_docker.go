//go:build mock

package main

import (
	"context"
	"errors"
	"flag"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"journal-agent/recording"
)

func init() {
	developmentCommands["record-docker"] = recordDocker
}

// recordedInstallerExchange is the exchange of the recording run that holds the installer's Docker calls.
const recordedInstallerExchange = "installer"

// recordDocker passes the installer's Docker command line through to the daemon on a socket of its own, keeping each
// call in the recording run's drafts while the journal's recording run is open, an attach passed through and kept as upgraded.
func recordDocker(arguments []string) error {
	flags := flag.NewFlagSet("record-docker", flag.ContinueOnError)
	listen := flags.String("listen", "", "the socket the Docker command line is pointed at")
	server := flags.String("server", "", "the daemon's socket")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	if *listen == "" || *server == "" {
		return errors.New("record-docker takes --listen <socket> and --server <daemon socket>")
	}
	listener, err := net.Listen("unix", *listen)
	if err != nil {
		return err
	}
	defer func() { _ = os.Remove(*listen) }()
	return http.Serve(listener, dockerTap(*server, recording.JournalDrafts()))
}

// dockerTap is the proxy to the daemon's socket whose calls go through the recording run's Docker tap.
func dockerTap(server string, drafts recording.Drafts) http.Handler {
	daemon := &http.Transport{DialContext: func(ctx context.Context, _, _ string) (net.Conn, error) {
		return (&net.Dialer{}).DialContext(ctx, "unix", server)
	}}
	next := recording.RecordDocker{Next: daemon, Recorder: recording.NewCallRecorder(recording.WireDocker, drafts),
		Exchange: recordedInstallerExchange}
	target := &url.URL{Scheme: "http", Host: "docker"}
	return &httputil.ReverseProxy{
		Rewrite: func(request *httputil.ProxyRequest) {
			request.SetURL(target)
			request.Out.Host = request.In.Host
		},
		Transport:     next,
		FlushInterval: -1,
	}
}
