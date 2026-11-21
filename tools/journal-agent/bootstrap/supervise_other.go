//go:build !linux

package bootstrap

import (
	"fmt"
	"os"
)

// Layout is where the init finds its pieces; the init runs on Linux only.
type Layout struct{}

// ContainerLayout is the layout inside a protected-account container.
var ContainerLayout = Layout{}

// Main refuses to run: the init drops users and capabilities, which only Linux offers.
func Main(Layout, []string) int {
	fmt.Fprintln(os.Stderr, "journal-init: the init runs on Linux only")

	return 1
}
