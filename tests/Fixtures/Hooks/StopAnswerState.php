<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;

/**
 * A test state that answers a stop with what it was given: nothing, a decision, a line, or several to yield.
 */
final class StopAnswerState extends AgentState
{
    public function __construct(private readonly mixed $answer) {}

    public function onStop(StopRequested $input): mixed
    {
        return $this->answer;
    }
}
