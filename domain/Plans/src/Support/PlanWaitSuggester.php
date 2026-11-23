<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use Domain\Plans\Models\PhaseTask;
use Domain\Tasks\Data\TaskGraph;
use Domain\Tasks\Data\TaskGraphEdge;
use Domain\Tasks\Data\TaskGraphSuggestion;

/**
 * Suggests the waits a plan's tasks need: phase order already keeps a later phase back, so a wait on a task of an
 * earlier phase adds nothing, and neither does a wait other waits already imply. It only ever leaves waits out.
 */
final readonly class PlanWaitSuggester
{
    public function suggestionFor(TaskGraph $graph): TaskGraphSuggestion
    {
        $phaseOf = PhaseTask::phaseNumbersInPlan($graph->planId);

        $needed = array_values(array_filter(
            $graph->edges,
            fn (TaskGraphEdge $edge) => ! $this->isKeptBackByPhase($edge, $phaseOf),
        ));

        $kept = array_values(array_filter(
            $needed,
            fn (TaskGraphEdge $edge) => ! $this->isImplied($edge, $needed),
        ));

        return TaskGraphSuggestion::from(['baseVersion' => $graph->version, 'edges' => $kept]);
    }

    /**
     * Whether the task waited on lies in an earlier phase than the task that waits.
     *
     * @param  array<string, int>  $phaseOf
     */
    private function isKeptBackByPhase(TaskGraphEdge $edge, array $phaseOf): bool
    {
        if (! isset($phaseOf[$edge->prerequisiteId], $phaseOf[$edge->dependentId])) {
            return false;
        }

        return $phaseOf[$edge->prerequisiteId] < $phaseOf[$edge->dependentId];
    }

    /**
     * Whether the other waits already lead from this wait's prerequisite to its dependent.
     *
     * @param  list<TaskGraphEdge>  $edges
     */
    private function isImplied(TaskGraphEdge $edge, array $edges): bool
    {
        $seen = [$edge->prerequisiteId => true];
        $frontier = [$edge->prerequisiteId];

        while ($frontier !== []) {
            $next = [];

            foreach ($edges as $other) {
                if ($other === $edge || ! in_array($other->prerequisiteId, $frontier, true)) {
                    continue;
                }

                if ($other->dependentId === $edge->dependentId) {
                    return true;
                }

                if (! isset($seen[$other->dependentId])) {
                    $seen[$other->dependentId] = true;
                    $next[] = $other->dependentId;
                }
            }

            $frontier = $next;
        }

        return false;
    }
}
