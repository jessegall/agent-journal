<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Docking\Cards\ComposedCard;
use App\Docking\Exceptions\DockSourceUnavailable;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Docking\Sources\DockDefinition;
use Domain\Documents\Models\Document;

/**
 * Reads published documents to dock: one by its id, and a batch in one query, with their current revisions.
 */
final readonly class DocumentDocking implements DockableProvider
{
    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        return Document::query()
            ->sharedPublished()
            ->whereKey($id)
            ->firstOr(fn () => throw DockSourceUnavailable::of($definition->type, $id));
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        $documents = Document::query()
            ->sharedPublished()
            ->with('currentRevision')
            ->whereKey($ids)
            ->readExactly(count($ids))
            ->get();

        $cards = [];

        foreach ($documents as $document) {
            $cards[] = new ComposedCard($document->identifyFor($definition), $document->composeDockCard($context));
        }

        return $cards;
    }
}
