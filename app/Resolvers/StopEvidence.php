<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Processes\StopEvidence as StopEvidenceContract;
use App\Exceptions\StopCheckMissing;
use App\Models\Sessions\StopCheck;
use App\Values\StopCheckReference;
use App\Values\StopCheckResult;

/**
 * Reads a stop attempt of the current session and its results from the records the host's command stored.
 */
final readonly class StopEvidence implements StopEvidenceContract
{
    public function result(StopCheckReference $attempt): StopCheckResult
    {
        $record = StopCheck::query()
            ->withResults()
            ->findOr($attempt->attemptId, StopCheckMissing::throwing()->for($attempt->attemptId));

        $statuses = [];
        $summaries = [];

        foreach ($record->results as $stopRecord) {
            $statuses[$stopRecord->condition_key] = $stopRecord->status;
            $summaries[$stopRecord->condition_key] = $stopRecord->summary;
        }

        return new StopCheckResult($record->state, $statuses, $summaries);
    }
}
