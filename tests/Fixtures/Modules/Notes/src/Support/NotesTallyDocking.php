<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use App\Support\Cards\ComposedCard;
use App\Exceptions\DockSourceUnavailable;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\Contracts\DockableProvider;
use App\Support\Sources\DockDefinition;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * Makes the notes tally again from its key and the notes; any other key is nothing to dock.
 */
final readonly class NotesTallyDocking implements DockableProvider
{
    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        if ($id !== NotesTally::KEY) {
            throw DockSourceUnavailable::of($definition->type, $id);
        }

        return new NotesTally(Note::query()->count());
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        if (! in_array(NotesTally::KEY, $ids, true)) {
            return [];
        }

        $tally = new NotesTally(Note::query()->count());

        return [new ComposedCard($tally->identifyFor($definition), $tally->composeDockCard($context))];
    }
}
