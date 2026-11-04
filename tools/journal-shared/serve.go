package main

import (
	"io"
	"net/http"
	"time"

	"github.com/jessegall/agent-journal/tools/journal-shared/web"
)

// defaultListen keeps a new server reachable from its own machine only, until someone names another address.
const defaultListen = "127.0.0.1:8740"

func serve(arguments []string, errs io.Writer) error {
	flags, data := newFlags("serve", errs)
	listen := flags.String("listen", defaultListen, "the host:port to listen on")
	if _, err := parse(flags, arguments, 0); err != nil {
		return err
	}
	database, err := openData(*data)
	if err != nil {
		return err
	}
	defer database.Close()
	server := &http.Server{
		Addr:              *listen,
		Handler:           web.Routes(database, protocol),
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       30 * time.Second,
	}
	return server.ListenAndServe()
}
