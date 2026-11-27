<?php

declare(strict_types=1);

namespace Tests\Fixtures\StateReturns;

use App\Stacks\AgentState;
use App\Support\Decisions\Decision;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\SessionStarted;
use Generator;

/**
 * A state that answers with arrays and plain values, which the state return check names.
 */
final class ArrayAnswerState extends AgentState
{
    public function onEnter(): array
    {
        return [];
    }

    public function onSessionStart(SessionStarted $input): iterable
    {
        yield ['a line'];

        yield 'a word';
    }

    public function onExit(): void
    {
        $later = fn () => [];
    }

    public function onCompaction(ContextCompacted $input): Generator
    {
        yield Decision::delegate();
    }

    public function onSessionEnd(SessionEnded $input): Generator
    {
        yield from $this->answers();
    }

    /**
     * @return Generator<int, Decision>
     */
    private function answers(): Generator
    {
        yield Decision::delegate();
    }
}
