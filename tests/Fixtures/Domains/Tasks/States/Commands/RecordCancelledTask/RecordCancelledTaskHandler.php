<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands\RecordCancelledTask;

use App\Contracts\CommandHandler;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordCancelledTask\RecordCancelledTaskCommand;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchLog;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchOutcome;

final readonly class RecordCancelledTaskHandler implements CommandHandler
{
    public function __construct(private TaskWatchLog $log) {}

    public function handle(RecordCancelledTaskCommand $command): void
    {
        $this->log->record(TaskWatchOutcome::Cancelled, $command);
    }
}
