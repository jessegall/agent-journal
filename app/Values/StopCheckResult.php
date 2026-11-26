<?php

declare(strict_types=1);

namespace App\Values;

use App\Sessions\Enums\StopCheckStatus;
use App\Sessions\Enums\StopConditionResultType;

/**
 * Where a stop attempt stands and how each of its conditions ended, by condition key, with the summaries a helper
 * reads; never the raw output.
 */
final readonly class StopCheckResult
{
    /**
     * @param  array<string, StopConditionResultType>  $statuses  condition key => how it ended
     * @param  array<string, string>  $summaries  condition key => its short summary
     */
    public function __construct(
        public StopCheckStatus $status,
        public array $statuses,
        public array $summaries,
    ) {}

    /**
     * The result the host's reports settle an attempt with.
     *
     * @param  list<StopConditionResultReport>  $reports
     */
    public static function ofReports(StopCheckStatus $status, array $reports): self
    {
        $statuses = [];
        $summaries = [];

        foreach ($reports as $report) {
            $statuses[$report->conditionKey] = $report->status;
            $summaries[$report->conditionKey] = $report->summary;
        }

        return new self($status, $statuses, $summaries);
    }

    /**
     * What the conditions that refused the stop said, one line each, for the helper to act on.
     */
    public function failureSummary(): string
    {
        $lines = [];

        foreach ($this->statuses as $key => $status) {
            if ($status->refusesStop()) {
                $lines[] = sprintf('- %s (%s): %s', $key, $status->value, $this->summaries[$key]);
            }
        }

        return implode(PHP_EOL, $lines);
    }
}
