<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Processes\StopEvidence;
use App\Exceptions\StopAttemptMissing;
use App\Models\StopAttempt;
use App\Values\RelationRead;
use App\Values\StopAttemptReference;
use App\Values\StopAttemptResult;

/**
 * Reads a stop attempt of the current session and its results from the records the host's command stored.
 */
final readonly class StopAttemptRecords implements StopEvidence
{
    public function result(StopAttemptReference $attempt): StopAttemptResult
    {
        $record = StopAttempt::query()
            ->with(['results' => RelationRead::complete(max: 50)->constraint()])
            ->findOr($attempt->attemptId, fn () => throw StopAttemptMissing::for($attempt->attemptId));

        $statuses = [];
        $summaries = [];

        foreach ($record->results as $stopRecord) {
            $statuses[$stopRecord->condition_key] = $stopRecord->status;
            $summaries[$stopRecord->condition_key] = $stopRecord->summary;
        }

        return new StopAttemptResult($record->state, $statuses, $summaries);
    }
}
