<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Bus\Contracts\Command;
use App\Contracts\Events\Event;
use App\Stacks\AgentState;
use App\Stacks\Decisions\Contracts\AnswerPart;
use App\Stacks\References\StateReference;
use App\Support\Inputs\StopRequested;
use Generator;

/**
 * A test state that answers a stop with what it was given: nothing, a decision, a line, or several to yield.
 */
final class StopAnswerState extends AgentState
{
    /**
     * @param  AnswerPart|Command<mixed>|Event|Generator<int, AnswerPart|Command<mixed>|Event>  $answer
     */
    public function __construct(private readonly AnswerPart|Command|Event|StateReference|Generator $answer) {}

    /**
     * @return AnswerPart|Command<mixed>|Event|StateReference|Generator<int, AnswerPart|Command<mixed>|Event|StateReference>
     */
    public function onStop(StopRequested $input): AnswerPart|Command|Event|StateReference|Generator
    {
        return $this->answer;
    }
}
