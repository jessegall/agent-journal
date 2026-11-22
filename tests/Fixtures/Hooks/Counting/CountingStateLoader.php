<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Counting;

use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\StateLoading\Contracts\StateLoader;
use App\Hooks\StateLoading\StateSet;

/**
 * Loads a fresh counting state for each frame, so only the values its frame saved can bring a count back.
 */
final class CountingStateLoader implements StateLoader
{
    public function stateClass(): string
    {
        return CountingState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn () => new CountingState());
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
