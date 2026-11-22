<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\StopAttemptState;
use App\Enums\StopResultType;

/**
 * Where a stop attempt stands and how each of its conditions ended, by condition key, with the summaries a helper
 * reads; never the raw output.
 */
final readonly class StopAttemptResult
{
    /**
     * @param  array<string, StopResultType>  $statuses  condition key => how it ended
     * @param  array<string, string>  $summaries  condition key => its short summary
     */
    public function __construct(
        public StopAttemptState $state,
        public array $statuses,
        public array $summaries,
    ) {}

    /**
     * What the conditions that refused the stop said, one line each, for the helper to act on.
     */
    public function failureSummary(): string
    {
        $lines = ['A stop condition refused the stop:'];

        foreach ($this->statuses as $key => $status) {
            if ($status->refusesStop()) {
                $lines[] = sprintf('- %s (%s): %s', $key, $status->value, $this->summaries[$key]);
            }
        }

        return implode(PHP_EOL, $lines);
    }
}
