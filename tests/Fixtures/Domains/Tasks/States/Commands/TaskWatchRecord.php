<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands;

use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchLog;

/**
 * @extends Command<void>
 */
abstract readonly class TaskWatchRecord extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $taskId, public int $watchNumber) {}

    public function subject(): string
    {
        return TaskWatchLog::class;
    }
}
