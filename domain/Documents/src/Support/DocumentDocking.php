<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Exceptions\DockSourceUnavailable;
use App\Support\Cards\ComposedCard;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\Contracts\DockableProvider;
use App\Support\Sources\DockDefinition;
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
            ->firstOr(DockSourceUnavailable::throwing()->of($definition->type, $id));
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
