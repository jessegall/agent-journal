<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Contracts\Bus\Command;
use App\Contracts\Events\Event;
use App\Support\Decisions\Contracts\AnswerPart;
use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;

/**
 * A test state that answers a stop with what it was given: nothing, a decision, a line, or several to yield.
 */
final class StopAnswerState extends AgentState
{
    /**
     * @param  AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>  $answer
     */
    public function __construct(private readonly AnswerPart|Command|Event|iterable $answer) {}

    /**
     * @return AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>
     */
    public function onStop(StopRequested $input): AnswerPart|Command|Event|iterable
    {
        return $this->answer;
    }
}
