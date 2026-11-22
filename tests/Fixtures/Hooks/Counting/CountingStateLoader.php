<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Counting;

use App\Support\Decisions\StateReferences;
use App\Enums\SessionTransferType;
use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\StateLoading\StateSet;

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
