<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use App\Docking\Cards\ComposedCard;
use App\Docking\Exceptions\DockSourceUnavailable;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Docking\Sources\DockDefinition;
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
