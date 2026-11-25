<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Values\StopCheckReference;
use Domain\Helpers\Models\HelperJob;
use PhpOption\Option;

/**
 * Finds the open helper job a Core fact about started work names, and how the job refers to the stop attempt behind
 * it.
 */
final class JobStopEvidence
{
    public const string ATTEMPT_PREFIX = 'stop-attempt:';

    /**
     * The open job of this id, locked for its change; none once it ended.
     *
     * @return Option<HelperJob>
     */
    public static function openJob(string $jobId): Option
    {
        $helperJob = HelperJob::query()
            ->acrossActors()
            ->open()
            ->whereKey($jobId)
            ->lock('for update')
            ->first();

        return Option::fromValue($helperJob);
    }

    public static function referenceOf(StopCheckReference $attempt): string
    {
        return self::ATTEMPT_PREFIX.$attempt->attemptId;
    }
}
