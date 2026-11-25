<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Exceptions\DockSourceUnavailable;
use App\Support\Cards\ComposedCard;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\Contracts\DockableProvider;
use App\Support\Sources\DockDefinition;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Plans\Resolvers\PlanRecords;
use Domain\Plans\Values\PlanCard;
use Illuminate\Database\Eloquent\Collection;

/**
 * Reads plans to dock: one by its id, and a batch with the cards every plan list builds, in a fixed number of
 * queries, and the titles of their current phases in one more.
 */
final readonly class PlanDocking implements DockableProvider
{
    public function __construct(private PlanRecords $plans) {}

    public function requireReadable(DockDefinition $definition, string $id): Dockable
    {
        $plan = Plan::query()->whereKey($id)->firstOr(DockSourceUnavailable::throwing()->of($definition->type, $id));

        return $this->docked($plan->newCollection([$plan]))[0];
    }

    public function cardsFor(DockDefinition $definition, array $ids, CardContext $context): array
    {
        $cards = [];

        foreach ($this->docked(Plan::query()->whereKey($ids)->readExactly(count($ids))->get()) as $plan) {
            $cards[] = new ComposedCard($plan->identifyFor($definition), $plan->composeDockCard($context));
        }

        return $cards;
    }

    /**
     * @param  Collection<int, Plan>  $plans
     * @return list<DockedPlan>
     */
    private function docked(Collection $plans): array
    {
        $titles = [];

        $phases = Phase::query()
            ->ofPlans($plans->modelKeys())
            ->readAll('the current phase of each docked plan is named by its title')
            ->get([
                'plan_id',
                'number',
                'title',
            ]);

        foreach ($phases as $phase) {
            $titles["{$phase->plan_id}:{$phase->number}"] = $phase->title;
        }

        return array_map(
            fn (PlanCard $card) => new DockedPlan($card, $titles["{$card->id}:{$card->currentPhase}"] ?? null),
            $this->plans->cardsOfPlans($plans),
        );
    }
}
