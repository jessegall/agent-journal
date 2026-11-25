<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\DockSourceUnavailable;
use App\Models\Runs\ProcessRun;
use App\Support\Cards\ComposedCard;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\Contracts\DockableProvider;
use App\Support\Sources\DockDefinition;

/**
 * Reads process runs to dock through the actor-scoped query alone: a run belongs to the actor that started it, so
 * another actor's run is not found, and inbox membership grants nothing. Parts load with the batch.
 */
final readonly class RunDocking implements DockableProvider
{
    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        return ProcessRun::query()
            ->withDockParts()
            ->whereKey($id)
            ->firstOr(DockSourceUnavailable::throwing()->of($definition->type, $id));
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        $cards = [];

        foreach (ProcessRun::query()->withDockParts()->whereKey($ids)->readExactly(count($ids))->get() as $run) {
            $cards[] = new ComposedCard($run->identifyFor($definition), $run->composeDockCard($context));
        }

        return $cards;
    }
}
