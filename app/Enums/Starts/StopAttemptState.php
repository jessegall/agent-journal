<?php

declare(strict_types=1);

namespace App\Enums\Starts;

/**
 * Where one stop attempt stands: its conditions wait for the host, all passed, one proved the stop refused, or the
 * results prove neither.
 */
enum StopAttemptState: string
{
    case Pending = 'pending';
    case Passed = 'passed';
    case Failed = 'failed';
    case Unresolved = 'unresolved';

    /**
     * The state the host's results settle an attempt in.
     *
     * @param  list<StopResultType>  $stepOutcomes
     */
    public static function settledBy(array $stepOutcomes): self
    {
        if (array_any($stepOutcomes, fn (StopResultType $stepOutcome): bool => $stepOutcome->refusesStop())) {
            return self::Failed;
        }

        if (array_all(
            $stepOutcomes,
            fn (StopResultType $stepOutcome): bool => $stepOutcome === StopResultType::Passed,
        )) {
            return self::Passed;
        }

        return self::Unresolved;
    }
}
