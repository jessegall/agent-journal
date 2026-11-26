// Development only: a TCP proxy that holds every chunk it forwards for half the added latency in each direction, so a
// host behind it sees the journal that much further away (tools/latency/start-proxy.sh runs it).
//   go run main.go -listen :8000 -target app:8000 -added 300ms
package main

import (
	"flag"
	"log"
	"net"
	"time"
)

// chunk is a piece of a connection's bytes and the moment it may be forwarded.
type chunk struct {
	bytes []byte
	dueAt time.Time
}

func main() {
	listen := flag.String("listen", ":8000", "the address the proxy listens on")
	target := flag.String("target", "app:8000", "the address every connection is forwarded to")
	added := flag.Duration("added", 300*time.Millisecond, "the latency added to one round trip")
	flag.Parse()

	listener, err := net.Listen("tcp", *listen)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("forwarding %s to %s with %s added per round trip", *listen, *target, *added)
	for {
		incoming, err := listener.Accept()
		if err != nil {
			log.Fatal(err)
		}
		go forward(incoming, *target, *added/2)
	}
}

// forward joins one connection to the target, holding each direction for the one-way delay.
func forward(incoming net.Conn, target string, oneWay time.Duration) {
	outgoing, err := net.Dial("tcp", target)
	if err != nil {
		log.Print(err)
		incoming.Close()
		return
	}
	defer incoming.Close()
	defer outgoing.Close()
	finished := make(chan struct{}, 2)
	go relay(incoming, outgoing, oneWay, finished)
	go relay(outgoing, incoming, oneWay, finished)
	<-finished
	<-finished
}

// relay copies from one side to the other, each chunk leaving the delay after it arrived, in order.
func relay(from, to net.Conn, delay time.Duration, finished chan<- struct{}) {
	queue := make(chan chunk, 1024)
	go send(queue, to, finished)
	buffer := make([]byte, 32*1024)
	for {
		count, err := from.Read(buffer)
		if count > 0 {
			queue <- chunk{bytes: append([]byte(nil), buffer[:count]...), dueAt: time.Now().Add(delay)}
		}
		if err != nil {
			close(queue)
			return
		}
	}
}

// send writes each queued chunk once it is due, and closes the writing side when the queue ends.
func send(queue <-chan chunk, to net.Conn, finished chan<- struct{}) {
	defer func() { finished <- struct{}{} }()
	defer closeWrite(to)
	for piece := range queue {
		time.Sleep(time.Until(piece.dueAt))
		if _, err := to.Write(piece.bytes); err != nil {
			return
		}
	}
}

// closeWrite ends the writing side so the other end reads its end of file, or closes the whole connection.
func closeWrite(connection net.Conn) {
	if tcp, isTCP := connection.(*net.TCPConn); isTCP {
		tcp.CloseWrite()
		return
	}
	connection.Close()
}
