<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Attributes\StackWide;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\States\AgentState;
use Closure;

/**
 * A shell handler that participates even below another matching handler.
 */
final class MarkedShellState extends AgentState
{
    /**
     * @param Closure(ShellCommandRequested): Decision $decide
     */
    public function __construct(private readonly Closure $decide) {}

    #[StackWide]
    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        return ($this->decide)($input);
    }
}
