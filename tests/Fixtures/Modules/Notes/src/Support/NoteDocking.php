<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use App\Exceptions\DockSourceUnavailable;
use App\Support\Cards\ComposedCard;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\Contracts\DockableProvider;
use App\Support\Sources\DockDefinition;
use App\Values\ProjectOwner;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * Reads notes to dock: one by its id, and a batch in one query; every viewer of the fixture may read a note.
 */
final readonly class NoteDocking implements DockableProvider
{
    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        return Note::query()->whereKey($id)->firstOr(fn () => throw DockSourceUnavailable::of($definition->type, $id));
    }

    public function ownerOf(DockDefinition $definition, string $id): ProjectOwner
    {
        return ProjectOwner::global();
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        $cards = [];

        foreach (Note::query()->whereKey($ids)->readExactly(count($ids))->get() as $note) {
            $cards[] = new ComposedCard($note->identifyFor($definition), $note->composeDockCard($context));
        }

        return $cards;
    }
}
