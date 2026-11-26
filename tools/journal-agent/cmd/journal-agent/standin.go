//go:build standin

package main

import (
	"context"
	"errors"
	"flag"
	"net"
	"os"
	"os/signal"
	"syscall"

	"journal-agent/dockerstandin"
)

func init() {
	developmentCommands["standin"] = standin
}

// standin runs a stand-in for a dependency the suite must not reach for real: "standin docker --socket <path>"
// serves the Docker stand-in daemon on that socket, its containers running the echo program, until stopped.
func standin(arguments []string) error {
	if len(arguments) == 0 || arguments[0] != "docker" {
		return errors.New("usage: journal-agent standin docker --socket <path> --image <reference>...")
	}
	flags := flag.NewFlagSet("standin docker", flag.ContinueOnError)
	socket := flags.String("socket", "", "the Unix socket the daemon listens on")
	image := flags.String("image", "", "an image the daemon holds, by digest")
	if err := flags.Parse(arguments[1:]); err != nil {
		return err
	}
	listener, err := net.Listen("unix", *socket)
	if err != nil {
		return err
	}
	daemon := dockerstandin.Serve(listener, *image)
	daemon.Programs = func(*dockerstandin.Container) dockerstandin.Program { return dockerstandin.EchoProgram }
	defer daemon.Stop()
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	<-ctx.Done()
	return nil
}
