package hostapi

import (
	"context"

	"journal-agent/client"
	"journal-agent/host"
)

// InstructionHandlers carry out every instruction the journal sends, a method to each instruction type, given the
// instruction and its payload read strictly, and answer the instruction's reply.
type InstructionHandlers interface {
	OpenContainer(ctx context.Context, instruction Instruction, payload OpenPlan) (Opened, error)
	OpenProcess(ctx context.Context, instruction Instruction, payload OpenPlan) (Opened, error)
	WriteKeys(ctx context.Context, instruction Instruction, payload KeyWrite) (KeysWritten, error)
	WriteStdin(ctx context.Context, instruction Instruction, payload StdinWrite) (Empty, error)
	CloseStdin(ctx context.Context, instruction Instruction) (Empty, error)
	OpenPrivate(ctx context.Context, instruction Instruction) (Empty, error)
	WritePrivate(ctx context.Context, instruction Instruction, payload PrivateWrite) (Empty, error)
	ClosePrivate(ctx context.Context, instruction Instruction) (Empty, error)
	Resize(ctx context.Context, instruction Instruction, payload TerminalSize) (Empty, error)
	Signal(ctx context.Context, instruction Instruction, payload SignalPlan) (Empty, error)
	Stop(ctx context.Context, instruction Instruction, payload StopPlan) (Empty, error)
	Stream(ctx context.Context, instruction Instruction, payload StreamPlan) (Empty, error)
	Snapshot(ctx context.Context, instruction Instruction) (Empty, error)
	RunFenced(ctx context.Context, instruction Instruction, payload FencedPlan) (FencedResults, error)
	AllowImages(ctx context.Context, instruction Instruction, payload ImagesPlan) (ImagesAllowed, error)
	RunContainers(ctx context.Context, instruction Instruction, payload ContainerRuns) (ContainerRunResults, error)
	ListContainers(ctx context.Context, instruction Instruction, payload host.ContainerLabel) (ContainerNames, error)
	RemoveNetwork(ctx context.Context, instruction Instruction, payload NetworkRemoval) (Empty, error)
	Remove(ctx context.Context, instruction Instruction, payload RemovePlan) (Empty, error)
	ReadProject(ctx context.Context, instruction Instruction, payload client.ProjectRead) (Empty, error)
	Upgrade(ctx context.Context, instruction Instruction, payload UpgradePlan) (UpgradeStarted, error)
}

// Executors carry out each instruction through its handler, its payload read strictly into its type first.
func Executors(handlers InstructionHandlers) map[string]Executor {
	return map[string]Executor{
		"open_container":  carrying(handlers.OpenContainer),
		"open_process":    carrying(handlers.OpenProcess),
		"write_keys":      carrying(handlers.WriteKeys),
		"write_stdin":     carrying(handlers.WriteStdin),
		"close_stdin":     carryingNothing(handlers.CloseStdin),
		"open_private":    carryingNothing(handlers.OpenPrivate),
		"write_private":   carrying(handlers.WritePrivate),
		"close_private":   carryingNothing(handlers.ClosePrivate),
		"resize":          carrying(handlers.Resize),
		"signal":          carrying(handlers.Signal),
		"stop":            carrying(handlers.Stop),
		"stream":          carrying(handlers.Stream),
		"snapshot":        carryingNothing(handlers.Snapshot),
		"run_fenced":      carrying(handlers.RunFenced),
		"allow_images":    carrying(handlers.AllowImages),
		"run_containers":  carrying(handlers.RunContainers),
		"list_containers": carrying(handlers.ListContainers),
		"remove_network":  carrying(handlers.RemoveNetwork),
		"remove":          carrying(handlers.Remove),
		"read_project":    carrying(handlers.ReadProject),
		"upgrade":         carrying(handlers.Upgrade),
	}
}
