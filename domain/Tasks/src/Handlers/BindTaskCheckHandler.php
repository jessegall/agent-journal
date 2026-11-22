<?php

declare(strict_types=1);

namespace Domain\Tasks\Handlers;

use App\Contracts\CommandHandler;
use App\Processes\Contracts\ResultReceipts;
use App\Processes\Enums\AssessmentOutcome;
use Domain\Tasks\Commands\BindTaskCheck;
use Domain\Tasks\Models\TaskCheck;

final readonly class BindTaskCheckHandler implements CommandHandler
{
    public function __construct(private ResultReceipts $receipts) {}

    public function handle(BindTaskCheck $command): void
    {
        $result = $this->receipts->find($command->receiptId)->getOrElse(null);

        if ($result === null || $result->outcome === AssessmentOutcome::Unavailable) {
            return;
        }

        $check = TaskCheck::ofProcessRun($result->runId);

        if ($check === null) {
            return;
        }

        $check->bind($result);
    }
}
