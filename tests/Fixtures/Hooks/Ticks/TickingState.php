<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Contracts\TickableState;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\States\AgentState;
use App\Support\Ticks\TickCommands;
use App\Support\Ticks\TickContext;

/**
 * A fixture state that ticks and asks for nothing; a test says whether its work is done.
 */
final class TickingState extends AgentState implements TickableState
{
    public function __construct(private readonly bool $finished) {}

    /**
     * The state of a frame whose work is done when its subject is one of the finished subject ids.
     *
     * @param  list<string>  $finishedSubjects
     */
    public static function of(StateReference $reference, array $finishedSubjects): self
    {
        return new self(
            $reference->subject instanceof SubjectReference
                && in_array($reference->subject->id, $finishedSubjects, true),
        );
    }

    public function isFinished(): bool
    {
        return $this->finished;
    }

    public function onTick(TickContext $tick): TickCommands
    {
        return TickCommands::none();
    }
}
