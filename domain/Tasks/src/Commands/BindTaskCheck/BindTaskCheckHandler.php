<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\BindTaskCheck;

use App\Contracts\ResultReceipts;
use App\Enums\AssessmentOutcome;
use Domain\Tasks\Commands\Support\TaskCommandHandler;
use Domain\Tasks\Models\TaskCheck;

final readonly class BindTaskCheckHandler extends TaskCommandHandler
{
    public function __construct(private ResultReceipts $receipts) {}

    public function handle(BindTaskCheckCommand $command): void
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
