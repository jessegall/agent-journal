<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands\RecordFinishedTask;

use App\Contracts\Bus\CommandHandler;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordFinishedTask\RecordFinishedTaskCommand;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchLog;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchOutcome;

final readonly class RecordFinishedTaskHandler implements CommandHandler
{
    public function __construct(private TaskWatchLog $log) {}

    public function handle(RecordFinishedTaskCommand $command): void
    {
        $this->log->record(TaskWatchOutcome::Finished, $command);
    }
}
