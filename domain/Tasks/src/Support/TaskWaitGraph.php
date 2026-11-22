<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;

/**
 * Answers whether a new wait would close a cycle: it walks from the prerequisite along the waits it has, in bounded
 * steps, looking for the dependent. Run under the graph lock, so no other change moves the graph meanwhile.
 */
final readonly class TaskWaitGraph
{
    public const int MOST_TASKS_WALKED = 5000;

    /**
     * @throws TaskWaitRefused
     */
    public function assertNoCycle(Task $dependent, Task $prerequisite): void
    {
        $seen = [$prerequisite->id => true];
        $frontier = [$prerequisite->id];

        while ($frontier !== []) {
            $next = array_values(array_filter(
                TaskWait::prerequisiteIdsOf($frontier, self::MOST_TASKS_WALKED),
                fn (string $id) => ! isset($seen[$id]),
            ));

            if (in_array($dependent->id, $next, true)) {
                throw TaskWaitRefused::wouldCycle($dependent->number, $prerequisite->number);
            }

            foreach ($next as $id) {
                $seen[$id] = true;
            }

            if (count($seen) > self::MOST_TASKS_WALKED) {
                throw TaskWaitRefused::tooDeep($dependent->number);
            }

            $frontier = $next;
        }
    }
}
