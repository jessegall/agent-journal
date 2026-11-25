<?php

declare(strict_types=1);

namespace App\Commands\Sessions\RecordStopConditionResults;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Sessions\StopCheckState;
use App\Exceptions\StopResultsRefused;
use App\Models\Sessions\StopCheck;
use App\Models\Sessions\StopConditionResult;
use App\Values\StopAttemptResult;
use App\Values\StopResultReport;

final readonly class RecordStopConditionResultsHandler implements CommandHandler
{
    public function handle(RecordStopConditionResultsCommand $command): StopCheckState
    {
        $attempt = StopCheck::query()
            ->acrossSessions()
            ->lockForUpdate()
            ->findOr($command->attemptId, StopResultsRefused::throwing()->unknownAttempt($command->attemptId));

        $submission = $command->submissionDigest();

        if ($attempt->isSettled() && $attempt->wasSubmittedAs($submission)) {
            return $attempt->state;
        }

        if ($attempt->isSettled()) {
            throw StopResultsRefused::conflicting($attempt->id);
        }

        if (! $attempt->isFor($command->policyDigest, $command->workspaceGeneration)) {
            throw StopResultsRefused::stale($attempt->id);
        }

        if (! $command->isEachConditionReportedOnce() || ! $attempt->asksFor($command->definitionHashes())) {
            throw StopResultsRefused::otherConditions($attempt->id);
        }

        StopConditionResult::createMany($attempt, $command->stopReports);

        $state = StopCheckState::settledBy(
            array_map(fn (StopResultReport $stopReport) => $stopReport->status, $command->stopReports),
        );

        $result = StopAttemptResult::ofReports($state, $command->stopReports);
        $attempt->settle($state, $submission, $result->failureSummary());

        return $state;
    }
}
