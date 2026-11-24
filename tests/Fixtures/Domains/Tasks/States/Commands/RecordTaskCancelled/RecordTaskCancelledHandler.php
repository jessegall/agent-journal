<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands\RecordTaskCancelled;

use App\Contracts\Bus\CommandHandler;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchLog;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchOutcome;

final readonly class RecordTaskCancelledHandler implements CommandHandler
{
    public function __construct(private TaskWatchLog $log) {}

    public function handle(RecordTaskCancelledCommand $command): void
    {
        $this->log->record(TaskWatchOutcome::Cancelled, $command);
    }
}
