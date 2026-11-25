<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Enums\Files\FileOperation;
use App\Enums\Hooks\ToolOutcome;
use App\Enums\Processes\ShellDialect;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\FileChange;
use App\Support\Inputs\Values\FileChanges;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\StopDetails;
use App\Support\Inputs\Values\ToolResult;
use App\Values\StackTarget;
use Tests\Fixtures\Hooks\ListedCommandParser;

/**
 * The hook inputs a state test gives one agent's session: a shell line it wants to run, a file edit, a tool it
 * finished and a stop, each signed for that session.
 */
final readonly class SessionHooks
{
    public function __construct(private StackTarget $target) {}

    /**
     * A shell line as the test's listed parser reads it.
     */
    public function shell(string $line): ShellCommandRequested
    {
        return new ShellCommandRequested(
            $this->identity($line),
            new ListedCommandParser()->parse($line, ShellDialect::Bash),
        );
    }

    public function toolFinished(string $command = 'ls'): ToolFinished
    {
        return new ToolFinished(
            $this->identity($command),
            new ToolResult('Bash', ToolOutcome::Succeeded, new DriverToolInput(['command' => $command])),
        );
    }

    /**
     * An edit of the files at these paths, in this order.
     */
    public function fileEdit(string ...$paths): FileEditRequested
    {
        $changes = array_map(fn (string $path) => new FileChange($path, FileOperation::Edit), array_values($paths));

        return new FileEditRequested($this->identity(implode(',', $paths)), new FileChanges($changes));
    }

    /**
     * The stop at the end of the turn, a callback of its own for each turn.
     */
    public function stop(string $turn = 'turn-1'): StopRequested
    {
        return new StopRequested($this->identity('stop', "stop-{$turn}"), new StopDetails($turn, false, ''));
    }

    /**
     * The stop the agent tries again right after a refused one.
     */
    public function stopAfterRefusal(): StopRequested
    {
        return new StopRequested($this->identity('stop again', 'stop-again'), new StopDetails('turn-1', true, ''));
    }

    private function identity(string $input, string $hookId = 'hook-input'): HookIdentity
    {
        return new HookIdentity($this->target->agentId, $this->target->sessionId, $hookId, hash('sha256', $input));
    }
}
