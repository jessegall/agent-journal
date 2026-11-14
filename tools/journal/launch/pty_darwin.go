package launch

import (
	"bytes"
	"os"
	"syscall"
	"unsafe"
)

func openTerminal() (*os.File, *os.File, error) {
	controller, err := os.OpenFile("/dev/ptmx", os.O_RDWR|syscall.O_NOCTTY, 0)
	if err != nil {
		return nil, nil, err
	}
	name := make([]byte, 128)
	if err := ioctl(controller, syscall.TIOCPTYGRANT, 0); err != nil {
		controller.Close()
		return nil, nil, err
	}
	if err := ioctl(controller, syscall.TIOCPTYUNLK, 0); err != nil {
		controller.Close()
		return nil, nil, err
	}
	if err := ioctl(controller, syscall.TIOCPTYGNAME, uintptr(unsafe.Pointer(&name[0]))); err != nil {
		controller.Close()
		return nil, nil, err
	}
	terminal, err := os.OpenFile(string(name[:bytes.IndexByte(name, 0)]), os.O_RDWR|syscall.O_NOCTTY, 0)
	if err != nil {
		controller.Close()
		return nil, nil, err
	}
	return controller, terminal, nil
}
