<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\States;

use App\Attributes\StateType;
use App\Enums\FrameReuse;
use App\Enums\SessionTransferType;
use App\Support\Decisions\Decision;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Support\States\AgentState;
use App\Values\AgentText;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Support\States\Support\LogDueStateReference;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The agent owes a log line on the task it works on: it may use a few more tools, and then only reads and the
 * journal's own tools, until it logs on the task. It finishes the moment it hears the task logged.
 */
#[StateType(LogDueStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::SessionOnly)]
final class LogDueState extends AgentState
{
    /**
     * The tool uses left before other work is refused.
     */
    public const int TOOL_USE_LIMIT = 5;

    private int $toolUses = 0;

    private bool $isLogged = false;

    public function __construct(private readonly string $taskId, private readonly int $number) {}

    public function frameReuse(): FrameReuse
    {
        return FrameReuse::PerSubject;
    }

    public function isFinished(): bool
    {
        return $this->isLogged;
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        return new Some($this->reason());
    }

    // ----------[ Hooks ]----------

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if ($input->command->readsOnly()) {
            return Decision::delegate();
        }

        return $this->workDecision();
    }

    public function onToolRequested(ToolRequested $input): Decision
    {
        return $this->workDecision();
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return $this->workDecision();
    }

    public function onToolFinished(ToolFinished $input): Decision
    {
        $this->toolUses++;

        return Decision::delegate();
    }

    // ----------[ Events ]----------

    public function onTaskLogged(TaskLogged $event): void
    {
        if ($event->taskId === $this->taskId) {
            $this->isLogged = true;
        }
    }

    // ----------[ Internals ]----------

    /**
     * Work passes while the budget lasts and is refused with the instruction to log once it is spent.
     */
    private function workDecision(): Decision
    {
        if ($this->toolUses >= self::TOOL_USE_LIMIT) {
            return Decision::deny($this->reason());
        }

        return Decision::delegate();
    }

    private function reason(): AgentText
    {
        return AgentText::of('tasks.log_due', ['task' => $this->number]);
    }
}
