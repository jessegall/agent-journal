<?php

declare(strict_types=1);

namespace App\Commands\RecordStopResults;

use App\Contracts\Bus\CommandHandler;
use App\Enums\StopAttemptState;
use App\Exceptions\StopResultsRefused;
use App\Models\Starts\StopAttempt;
use App\Models\Starts\StopResult;
use App\Models\Support\AgentSessionScope;
use App\Values\StopAttemptResult;
use App\Values\StopResultReport;

final readonly class RecordStopResultsHandler implements CommandHandler
{
    public function handle(RecordStopResultsCommand $command): StopAttemptState
    {
        $attempt = StopAttempt::query()
            ->withoutGlobalScope(AgentSessionScope::class)
            ->lockForUpdate()
            ->findOr($command->attemptId, fn () => throw StopResultsRefused::unknownAttempt($command->attemptId));

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

        StopResult::createAll(array_map(
            fn (StopResultReport $stopReport) => StopResult::unsaved($attempt, $stopReport),
            $command->stopReports,
        ));

        $state = StopAttemptState::settledBy(
            array_map(fn (StopResultReport $stopReport) => $stopReport->status, $command->stopReports),
        );

        $result = StopAttemptResult::ofReports($state, $command->stopReports);
        $attempt->settle($state, $submission, $result->failureSummary());

        return $state;
    }
}
