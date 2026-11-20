<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use Illuminate\Container\Attributes\Scoped;
use Tests\Fixtures\Domains\Tasks\States\Commands\TaskWatchRecord;

/**
 * Preserves which actor's command recorded each watched task outcome.
 */
#[Scoped]
final class TaskWatchLog
{
    /**
     * @var list<string>
     */
    public array $records = [];

    public function record(TaskWatchOutcome $outcome, TaskWatchRecord $command): void
    {
        $actor = $command->dispatchedBy();
        $this->records[] = "{$outcome->value}/{$command->taskId}/{$command->watchNumber}/{$actor->id}";
    }
}
