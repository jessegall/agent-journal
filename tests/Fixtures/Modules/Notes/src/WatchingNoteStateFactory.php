<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Values\EventCommands;

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
        return StateSet::build($references, function (StateReference $reference): WatchingNoteState {
            $result = EventCommands::none();

            if ($reference->subject instanceof SubjectReference) {
                $result = $result->withContext($reference->subject->id);
            }

            return new WatchingNoteState($result);
        });
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
