<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\Decisions\StateReferences;
use App\Support\StateLoading\StateSet;
use App\Enums\SessionTransferType;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\Support\Exceptions\SimulatedFailure;

/**
 * A state type that does not tick and must never be restored while the engine selects ticks.
 */
final class UnreadLoader implements StateLoader
{
    public function stateClass(): string
    {
        return ScriptedState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        throw SimulatedFailure::of('A state type that does not tick was restored.');
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::SessionOnly;
    }
}
