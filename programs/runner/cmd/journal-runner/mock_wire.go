//go:build mock

package main

import (
	"context"
	"flag"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"journal-runner/recorded"
	"journal-runner/recording"
)

// mockWire serves the journal's side of one recorded wire of a scenario on an address until stopped: each call gets
// the recorded journal's answer, its fakes bound to what the caller sent; each call the recording does not hold is
// written to the failures file, one line each, for the test to read. The address it listens on is printed first.
//
//	journal-runner mock wire --scenario <driver>/<name> --wire agent --failures <file>
func mockWire(arguments []string) error {
	flags := flag.NewFlagSet("mock wire", flag.ContinueOnError)
	named := flags.String("scenario", "", "the recorded scenario to play, as <driver>/<name>")
	wire := flags.String("wire", "", "the wire whose journal side is played, such as agent")
	failuresPath := flags.String("failures", "", "the file each call the recording does not hold is added to")
	untilInputEnds := flags.Bool("until-input-ends", false, "stop once standard input ends")
	if err := flags.Parse(arguments); err != nil {
		return err
	}
	driver, name, isNamed := strings.Cut(*named, "/")
	if !isNamed {
		return fmt.Errorf("name the scenario as <driver>/<name>, not %q", *named)
	}
	root, err := recorded.Root()
	if err != nil {
		return err
	}
	scenario, err := recorded.Load(root, driver, name)
	if err != nil {
		return err
	}
	replay, err := recorded.NewCallReplay(&failuresFile{path: *failuresPath}, scenario, recording.Wire(*wire))
	if err != nil {
		return err
	}
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return err
	}
	fmt.Println("http://" + listener.Addr().String())
	server := &http.Server{Handler: replay}
	go func() { _ = server.Serve(listener) }()
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	if *untilInputEnds {
		stopWhenInputEnds(stop)
	}
	<-ctx.Done()
	replay.Close()
	return server.Close()
}
