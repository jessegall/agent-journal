<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\References\StateReference;
use App\Hooks\StateLoading\Contracts\StateLoader;
use App\Hooks\StateLoading\StateSet;

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
