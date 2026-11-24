<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\CommandBus;
use Domain\Plans\Exceptions\PlanGraphChangeMissing;
use Domain\Plans\Models\Plan;
use Domain\Plans\Values\PlanGraphUndo;
use Domain\Tasks\Commands\ApplyTaskWaits\ApplyTaskWaitsCommand;
use Domain\Tasks\Contracts\TaskGraphResolver;
use Domain\Tasks\Data\TaskGraph;
use Domain\Tasks\Data\TaskGraphEdge;
use Domain\Tasks\Data\TaskGraphNode;
use Domain\Tasks\Values\TaskWaitPair;

/**
 * Suggest, Apply and Undo on a plan's graph: a suggestion is asked for and kept, applied as one version-checked change
 * of the waits, and undone by the inverse change at the version the apply left.
 */
final readonly class PlanGraphService
{
    public function __construct(
        private TaskGraphResolver $graphs,
        private PlanWaitSuggester $suggester,
        private PlanGraphChanges $changes,
        private CommandBus $commands,
        private CurrentActor $actors,
    ) {}

    public function suggest(Plan $plan): void
    {
        $graph = $this->graphs->graphOf($plan->id, $plan->taskIds(), '', '');

        $this->changes->keepSuggestion($plan->id, $this->actorId(), $this->suggester->suggestionFor($graph));
    }

    /**
     * @throws PlanGraphChangeMissing
     */
    public function apply(Plan $plan): void
    {
        $suggestion = $this->changes->suggestion($plan->id, $this->actorId())
            ->getOrThrow(PlanGraphChangeMissing::suggestion());

        $ids = $plan->taskIds();
        $now = $this->graphs->graphOf($plan->id, $ids, '', '')->edges;
        $added = $this->pairsOnlyIn($suggestion->edges, $now);
        $removed = $this->pairsOnlyIn($now, $suggestion->edges);

        $version = $this->commands->run(new ApplyTaskWaitsCommand($ids, $suggestion->baseVersion, $added, $removed));

        $this->changes->keepUndo($plan->id, $this->actorId(), new PlanGraphUndo($version, $removed, $added));
    }

    /**
     * @throws PlanGraphChangeMissing
     */
    public function undo(Plan $plan): void
    {
        $undo = $this->changes->undo($plan->id, $this->actorId())->getOrThrow(PlanGraphChangeMissing::undo());

        $this->commands->run(
            new ApplyTaskWaitsCommand($plan->taskIds(), $undo->version, $undo->added, $undo->removed),
        );

        $this->changes->forgetUndo($plan->id, $this->actorId());
    }

    /**
     * The graph as the reader offers it: with Suggest and Apply, the kept suggestion and Undo while one is kept, for an
     * actor who may change the waits of at least one of its tasks; as it is for anyone else.
     */
    public function offered(TaskGraph $graph, string $number): TaskGraph
    {
        $mayChange = array_filter($graph->nodes, fn (TaskGraphNode $node) => $node->mayEditWaits) !== [];

        if (! $mayChange) {
            return $graph;
        }

        $actorId = $this->actorId();

        $destinations = [
            'suggest' => route('plans.suggest-waits', ['plan' => $number], false),
            'apply' => route('plans.apply-waits', ['plan' => $number], false),
        ];

        if ($this->changes->undo($graph->planId, $actorId)->isDefined()) {
            $destinations['undo'] = route('plans.undo-waits', ['plan' => $number], false);
        }

        $offered = [...$graph->toArray(), 'destinations' => $destinations];

        foreach ($this->changes->suggestion($graph->planId, $actorId) as $suggestion) {
            $offered['suggestion'] = $suggestion->toArray();
        }

        return TaskGraph::from($offered);
    }

    /**
     * The waits of the first list the second does not have, as pairs of tasks.
     *
     * @param  list<TaskGraphEdge>  $edges
     * @param  list<TaskGraphEdge>  $others
     * @return list<TaskWaitPair>
     */
    private function pairsOnlyIn(array $edges, array $others): array
    {
        $present = array_flip(array_map(fn (TaskGraphEdge $edge) => self::waitKeyOf($edge), $others));

        return array_values(array_map(
            fn (TaskGraphEdge $edge) => new TaskWaitPair($edge->dependentId, $edge->prerequisiteId),
            array_filter($edges, fn (TaskGraphEdge $edge) => ! isset($present[self::waitKeyOf($edge)])),
        ));
    }

    private static function waitKeyOf(TaskGraphEdge $edge): string
    {
        return "{$edge->prerequisiteId}>{$edge->dependentId}";
    }

    private function actorId(): string
    {
        return $this->actors->actor()->id;
    }
}
