<?php

declare(strict_types=1);

namespace Tests\Fixtures\StateReturns;

use App\Support\Inputs\SessionStarted;
use App\Support\States\AgentState;

/**
 * A state that answers with arrays and plain values, which the state return check names.
 */
final class ArrayAnsweringState extends AgentState
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
}
