<?php

declare(strict_types=1);

namespace App\Sessions\Commands\RecordStopConditionResults;

use App\Bus\Contracts\CommandHandler;
use App\Models\Sessions\StopCheck;
use App\Models\Sessions\StopConditionResult;
use App\Sessions\Enums\StopCheckStatus;
use App\Sessions\Exceptions\StopConditionResultsRefused;
use App\Values\StopCheckResult;
use App\Values\StopConditionResultReport;

final readonly class RecordStopConditionResultsHandler implements CommandHandler
{
    public function handle(RecordStopConditionResultsCommand $command): StopCheckStatus
    {
        $attempt = StopCheck::query()
            ->acrossSessions()
            ->lockForUpdate()
            ->findOr($command->attemptId, StopConditionResultsRefused::throwing()->unknownAttempt($command->attemptId));

        $submission = $command->submissionDigest();

        if ($attempt->isSettled() && $attempt->wasSubmittedAs($submission)) {
            return $attempt->status;
        }

        if ($attempt->isSettled()) {
            throw StopConditionResultsRefused::conflicting($attempt->id);
        }

        if (! $attempt->isFor($command->policyDigest, $command->workspaceGeneration)) {
            throw StopConditionResultsRefused::stale($attempt->id);
        }

        if (! $command->isEachConditionReportedOnce() || ! $attempt->asksFor($command->definitionHashes())) {
            throw StopConditionResultsRefused::otherConditions($attempt->id);
        }

        StopConditionResult::createMany($attempt, $command->stopReports);

        $state = StopCheckStatus::settledBy(
            array_map(fn (StopConditionResultReport $stopReport) => $stopReport->status, $command->stopReports),
        );

        $result = StopCheckResult::ofReports($state, $command->stopReports);
        $attempt->settle($state, $submission, $result->failureSummary());

        return $state;
    }
}
