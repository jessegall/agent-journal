package launch

import (
	"os"
	"strconv"
	"syscall"
	"unsafe"
)

func openTerminal() (*os.File, *os.File, error) {
	controller, err := os.OpenFile("/dev/ptmx", os.O_RDWR|syscall.O_NOCTTY, 0)
	if err != nil {
		return nil, nil, err
	}
	var locked int32
	if err := ioctl(controller, syscall.TIOCSPTLCK, uintptr(unsafe.Pointer(&locked))); err != nil {
		controller.Close()
		return nil, nil, err
	}
	var number uint32
	if err := ioctl(controller, syscall.TIOCGPTN, uintptr(unsafe.Pointer(&number))); err != nil {
		controller.Close()
		return nil, nil, err
	}
	terminal, err := os.OpenFile("/dev/pts/"+strconv.Itoa(int(number)), os.O_RDWR|syscall.O_NOCTTY, 0)
	if err != nil {
		controller.Close()
		return nil, nil, err
	}
	return controller, terminal, nil
}
