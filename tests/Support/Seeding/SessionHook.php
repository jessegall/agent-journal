<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Agents\Inputs\Values\FileChange;
use App\Agents\Inputs\Values\FileChanges;
use App\Agents\Inputs\Values\StopDetails;
use App\Files\Enums\FileOperation;
use App\Hooks\Enums\ToolOutcome;
use App\Processes\Enums\ShellDialect;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\ToolResult;
use App\Values\StackTarget;
use Closure;
use Tests\Fixtures\Hooks\ListedCommandParser;

/**
 * A hook a state test's session sends: a shell line it wants to run, a file edit, a tool it finished or a stop, signed
 * for the session whose stack listens for it.
 */
final readonly class SessionHook
{
    /**
     * @param  Closure(HookIdentity): HookInput  $input
     */
    private function __construct(private string $signed, private string $hookId, private Closure $input) {}

    /**
     * A shell line as the test's listed parser reads it.
     */
    public static function shell(string $line): self
    {
        return new self($line, 'hook-input', fn (HookIdentity $identity) => new ShellCommandRequested(
            $identity,
            new ListedCommandParser()->parse($line, ShellDialect::Bash),
        ));
    }

    public static function toolFinished(string $command = 'ls'): self
    {
        return new self($command, 'hook-input', fn (HookIdentity $identity) => new ToolFinished(
            $identity,
            new ToolResult('Bash', ToolOutcome::Succeeded, new DriverToolInput(['command' => $command])),
        ));
    }

    /**
     * An edit of the files at these paths, in this order.
     */
    public static function fileEdit(string ...$paths): self
    {
        $changes = array_map(fn (string $path) => new FileChange($path, FileOperation::Edit), array_values($paths));

        return new self(
            implode(',', $paths),
            'hook-input',
            fn (HookIdentity $identity) => new FileEditRequested($identity, new FileChanges($changes)),
        );
    }

    /**
     * The stop at the end of the turn, a callback of its own for each turn.
     */
    public static function stop(string $turn = 'turn-1', string $closingWords = ''): self
    {
        return new self(
            'stop',
            "stop-{$turn}",
            fn (HookIdentity $identity) => new StopRequested($identity, new StopDetails($turn, false, $closingWords)),
        );
    }

    /**
     * The stop the agent tries again right after a refused one.
     */
    public static function stopAfterRefusal(): self
    {
        return new self(
            'stop again',
            'stop-again',
            fn (HookIdentity $identity) => new StopRequested($identity, new StopDetails('turn-1', true, '')),
        );
    }

    /**
     * The hook's input, signed for the session of the stack target.
     */
    public function inputFor(StackTarget $target): HookInput
    {
        $identity = new HookIdentity(
            $target->agentId,
            $target->sessionId,
            $this->hookId,
            hash('sha256', $this->signed),
        );

        return ($this->input)($identity);
    }
}
