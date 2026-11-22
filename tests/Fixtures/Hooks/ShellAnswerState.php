<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\States\AgentState;
use Closure;

/**
 * A test state that answers each shell line with what its closure gives for it.
 */
final class ShellAnswerState extends AgentState
{
    /**
     * @param  Closure(ShellCommandRequested): mixed  $answer
     */
    public function __construct(private readonly Closure $answer) {}

    public function onShellCommand(ShellCommandRequested $input): mixed
    {
        return ($this->answer)($input);
    }
}
