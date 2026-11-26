<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\States\Support;

use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;

final class LogDueStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'tasks.log_due';
    }

    public static function forTask(string $taskId, int $number): StateReference
    {
        return self::about(new SubjectReference($taskId, 0), [
            'taskId' => $taskId,
            'number' => $number,
        ]);
    }
}
