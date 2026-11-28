<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use Domain\Plans\Values\PlanGraphUndo;
use Domain\Tasks\Data\TaskGraphSuggestion;
use Illuminate\Contracts\Cache\Repository;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The suggestion one actor asked for on one plan's graph, and the undo of the one they applied, kept for a quarter of
 * an hour so the next read of the graph and the next post find them.
 */
final readonly class PlanGraphCache
{
    private const int KEPT_SECONDS = 900;

    public function __construct(private Repository $cache) {}

    public function keepSuggestion(string $planId, string $actorId, TaskGraphSuggestion $suggestion): void
    {
        $this->cache->put($this->key('suggestion', $planId, $actorId), $suggestion, self::KEPT_SECONDS);
    }

    /**
     * @return Option<TaskGraphSuggestion>
     */
    public function suggestion(string $planId, string $actorId): Option
    {
        $kept = $this->cache->get($this->key('suggestion', $planId, $actorId));

        if ($kept instanceof TaskGraphSuggestion) {
            return new Some($kept);
        }

        return None::create();
    }

    public function keepUndo(string $planId, string $actorId, PlanGraphUndo $undo): void
    {
        $this->cache->forget($this->key('suggestion', $planId, $actorId));
        $this->cache->put($this->key('undo', $planId, $actorId), $undo, self::KEPT_SECONDS);
    }

    /**
     * @return Option<PlanGraphUndo>
     */
    public function undo(string $planId, string $actorId): Option
    {
        $kept = $this->cache->get($this->key('undo', $planId, $actorId));

        if ($kept instanceof PlanGraphUndo) {
            return new Some($kept);
        }

        return None::create();
    }

    public function forgetUndo(string $planId, string $actorId): void
    {
        $this->cache->forget($this->key('undo', $planId, $actorId));
    }

    private function key(string $part, string $planId, string $actorId): string
    {
        return "plan-graph-{$part}:{$planId}:{$actorId}";
    }
}
