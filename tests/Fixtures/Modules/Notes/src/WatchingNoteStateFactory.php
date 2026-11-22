<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Support\Decisions\StateReferences;
use App\Enums\SessionTransferType;
use App\Support\References\StateReference;
use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\StateLoading\StateSet;

/**
 * Builds ordinary note listeners.
 */
final readonly class WatchingNoteStateFactory implements StateLoader
{
    public function stateClass(): string
    {
        return WatchingNoteState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build(
            $references,
            fn (StateReference $reference) => new WatchingNoteState(),
        );
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
