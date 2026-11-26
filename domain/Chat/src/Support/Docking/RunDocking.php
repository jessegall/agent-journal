<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Docking;

use App\Models\Runs\ProcessRun;
use App\Values\ProjectOwner;
use Domain\Chat\Contracts\Docking\CardContext;
use Domain\Chat\Contracts\Docking\Dockable;
use Domain\Chat\Contracts\Docking\DockableProvider;
use Domain\Chat\Exceptions\DockSourceUnavailable;
use Domain\Chat\Support\Cards\ComposedCard;
use Domain\Chat\Values\DockDefinition;

/**
 * Reads process runs to dock through the actor-scoped query alone: a run belongs to the actor that started it, so
 * another actor's run is not found, and inbox membership grants nothing. Parts load with the batch.
 */
final readonly class RunDocking implements DockableProvider
{
    /**
     * The type a run docks under.
     */
    public const string DOCK_TYPE = 'process.run';

    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        return new DockedRun(
            ProcessRun::query()
                ->withAllParts()
                ->whereKey($id)
                ->firstOr(DockSourceUnavailable::throwing()->of($definition->type, $id)),
        );
    }

    public function ownerOf(DockDefinition $definition, string $id): ProjectOwner
    {
        return ProcessRun::query()
            ->whereKey($id)
            ->firstOr(DockSourceUnavailable::throwing()->of($definition->type, $id))
            ->projectOwner();
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        $cards = [];

        foreach (ProcessRun::query()->withAllParts()->whereKey($ids)->readExactly(count($ids))->get() as $run) {
            $docked = new DockedRun($run);
            $cards[] = new ComposedCard($docked->identifyFor($definition), $docked->composeDockCard($context));
        }

        return $cards;
    }
}
