<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States\Commands\RecordTaskFinished;

use App\Bus\Contracts\CommandHandler;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchLog;
use Tests\Fixtures\Domains\Tasks\States\TaskWatchOutcome;

final readonly class RecordTaskFinishedHandler implements CommandHandler
{
    public function __construct(private TaskWatchLog $log) {}

    public function handle(RecordTaskFinishedCommand $command): void
    {
        $this->log->record(TaskWatchOutcome::Finished, $command);
    }
}
