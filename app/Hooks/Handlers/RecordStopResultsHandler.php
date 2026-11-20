<?php

declare(strict_types=1);

namespace App\Hooks\Handlers;

use App\Contracts\CommandHandler;
use App\Hooks\Commands\RecordStopResults;
use App\Hooks\Enums\StopAttemptState;
use App\Hooks\Exceptions\StopResultsRefused;
use App\Hooks\Models\StopAttempt;
use App\Hooks\Models\StopResult;
use App\Hooks\Models\Support\AgentSessionScope;
use App\Hooks\Values\StopResultReport;

final readonly class RecordStopResultsHandler implements CommandHandler
{
    public function handle(RecordStopResults $command): StopAttemptState
    {
        $attempt = StopAttempt::query()
            ->withoutGlobalScope(AgentSessionScope::class)
            ->lockForUpdate()
            ->find($command->attemptId)
            ?? throw StopResultsRefused::unknownAttempt($command->attemptId);
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

        foreach ($command->results as $result) {
            StopResult::record($attempt, $result);
        }

        $state = StopAttemptState::settledBy(
            array_map(fn (StopResultReport $result) => $result->status, $command->results),
        );
        $attempt->settle($state, $submission);

        return $state;
    }
}
