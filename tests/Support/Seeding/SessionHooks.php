<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Enums\Hooks\ToolOutcome;
use App\Enums\Processes\ShellDialect;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\StopDetails;
use App\Support\Inputs\Values\ToolResult;
use App\Values\StackTarget;
use Tests\Fixtures\Hooks\ListedCommandParser;

/**
 * The hook inputs a state test gives one agent's session: a shell line it wants to run, a tool it finished and a
 * stop, each signed for that session.
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

    public function stop(): StopRequested
    {
        return new StopRequested($this->identity('stop'), new StopDetails('turn-1', false, ''));
    }

    private function identity(string $input): HookIdentity
    {
        return new HookIdentity($this->target->agentId, $this->target->sessionId, 'hook-input', hash('sha256', $input));
    }
}
