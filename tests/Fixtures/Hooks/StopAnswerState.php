<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Bus\Contracts\Command;
use App\Contracts\Events\Event;
use App\Stacks\AgentState;
use App\Stacks\Decisions\Contracts\AnswerPart;
use App\Stacks\References\StateReference;
use App\Support\Inputs\StopRequested;

/**
 * A test state that answers a stop with what it was given: nothing, a decision, a line, or several to yield.
 */
final class StopAnswerState extends AgentState
{
    /**
     * @param  AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>  $answer
     */
    public function __construct(private readonly AnswerPart|Command|Event|StateReference|iterable $answer) {}

    /**
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>
     */
    public function onStop(StopRequested $input): AnswerPart|Command|Event|StateReference|iterable
    {
        return $this->answer;
    }
}
