<?php

declare(strict_types=1);

namespace App\Hooks\Resolvers;

use App\Hooks\Contracts\StopEvidence;
use App\Hooks\Exceptions\StopAttemptMissing;
use App\Hooks\Models\StopAttempt;
use App\Hooks\Values\StopAttemptReference;
use App\Hooks\Values\StopAttemptResult;
use App\Reads\Values\RelationRead;

/**
 * Reads a stop attempt of the current session and its results from the records the host's command stored.
 */
final readonly class StopAttemptRecords implements StopEvidence
{
    public function result(StopAttemptReference $attempt): StopAttemptResult
    {
        $record = StopAttempt::query()
            ->with(['results' => RelationRead::complete(max: 50)->constraint()])
            ->find($attempt->attemptId)
            ?? throw StopAttemptMissing::for($attempt->attemptId);
        $statuses = [];
        $summaries = [];

        foreach ($record->results as $stopRecord) {
            $statuses[$stopRecord->condition_key] = $stopRecord->status;
            $summaries[$stopRecord->condition_key] = $stopRecord->summary;
        }

        return new StopAttemptResult($record->state, $statuses, $summaries);
    }
}
