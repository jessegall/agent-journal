<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Docking\Cards\ComposedCard;
use App\Docking\Exceptions\DockSourceUnavailable;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Sources\Contracts\DockableProvider;
use App\Docking\Sources\DockDefinition;
use App\Processes\Models\ProcessRun;

/**
 * Reads process runs to dock through the actor-scoped query alone: a run belongs to the actor that started it, so
 * another actor's run is not found, and chat membership grants nothing. Parts load with the batch.
 */
final readonly class RunDocking implements DockableProvider
{
    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        return ProcessRun::query()
            ->withDockParts()
            ->whereKey($id)
            ->firstOr(fn () => throw DockSourceUnavailable::of($definition->type, $id));
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
