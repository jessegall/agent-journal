package main

import (
	"errors"
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
	certificate := flags.String("tls-cert", "", "the certificate file, to serve HTTPS")
	key := flags.String("tls-key", "", "the private key file of the certificate")
	if _, err := parse(flags, arguments, 0); err != nil {
		return err
	}
	if (*certificate == "") != (*key == "") {
		return errors.New("--tls-cert and --tls-key go together")
	}
	database, err := openData(*data)
	if err != nil {
		return err
	}
	defer database.Close()
	server := newServer(*listen, web.Routes(database, protocol))
	if *certificate != "" {
		return server.ListenAndServeTLS(*certificate, *key)
	}
	return server.ListenAndServe()
}

// newServer limits how long a client may take to send its headers and its body, so a slow or stuck client cannot hold
// the server.
func newServer(address string, handler http.Handler) *http.Server {
	return &http.Server{
		Addr:              address,
		Handler:           handler,
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       30 * time.Second,
		WriteTimeout:      60 * time.Second,
		IdleTimeout:       120 * time.Second,
	}
}
