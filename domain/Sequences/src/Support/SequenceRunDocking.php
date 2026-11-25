<?php

declare(strict_types=1);

namespace Domain\Sequences\Support;

use App\Exceptions\DockSourceUnavailable;
use App\Support\Cards\ComposedCard;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\Contracts\DockableProvider;
use App\Support\Sources\DockDefinition;
use App\Values\ProjectOwner;
use Domain\Sequences\Models\SequenceRun;

/**
 * Reads sequence runs for the chat lines that show them: one by its id, and a batch in one query.
 */
final readonly class SequenceRunDocking implements DockableProvider
{
    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        return SequenceRun::query()
            ->acrossActors()
            ->whereKey($id)
            ->firstOr(DockSourceUnavailable::throwing()->of($definition->type, $id));
    }

    /**
     * A sequence run is its runner's and of no project, so its placement is Global.
     */
    public function ownerOf(DockDefinition $definition, string $id): ProjectOwner
    {
        return ProjectOwner::global();
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        $runs = SequenceRun::query()->acrossActors()->whereKey($ids)->readExactly(count($ids))->get();
        $cards = [];

        foreach ($runs as $run) {
            $cards[] = new ComposedCard($run->identifyFor($definition), $run->composeDockCard($context));
        }

        return $cards;
    }
}
