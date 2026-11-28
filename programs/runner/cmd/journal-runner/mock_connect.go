//go:build mock

package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"journal-runner/device"
)

func mockConnect(arguments []string) error {
	if len(arguments) != 2 {
		return errors.New("name the test journal's origin and state folder")
	}
	folder, err := os.Getwd()
	if err != nil {
		return err
	}
	ticket, err := readTicket(os.Stdin)
	if err != nil {
		return err
	}
	connection := projectConnection{
		state: device.ConnectionState{Folder: arguments[1], CanonicalRoot: folder},
		origin: arguments[0], transport: &http.Client{Timeout: 30 * time.Second},
	}
	binding, err := connection.redeem(context.Background(), ticket)
	if err != nil {
		return err
	}
	if err := connection.setUp(binding); err != nil {
		return err
	}
	_, err = fmt.Fprintln(os.Stdout, binding.BindingID)
	return err
}
