<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Hooks\StateLoading\Contracts\StateLoader;
use App\Hooks\References\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\StateLoading\StateSet;
use App\Hooks\References\SubjectReference;
use App\Hooks\Enums\SessionTransferType;

/**
 * Builds ordinary note listeners whose subject, when present, supplies their context.
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
            fn (StateReference $reference) => new WatchingNoteState(
                $reference->subject instanceof SubjectReference ? [$reference->subject->id] : [],
            ),
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
