<?php

declare(strict_types=1);

namespace Domain\Plans\Console\Concerns;

use App\Values\CommandReport;
use Domain\Plans\Data\PlanWorkResultData;

/**
 * Reports what a cascade over a plan or phase changed: one line, or the whole answer as JSON with --json.
 */
trait ReportsPlanWork
{
    protected function workReport(PlanWorkResultData $work): CommandReport
    {
        $successReport = CommandReport::ending(self::SUCCESS);

        if ($this->option('json') === true) {
            $json = json_encode($work->toArray(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);

            return $successReport->line($json);
        }

        $counts = "{$work->changed} changed, {$work->unchanged} unchanged, {$work->skipped} skipped as finished";

        return $successReport
            ->line(
                sprintf(
                    'Cascade over %s %s and its unfinished work: %s.',
                    $work->root->recordType,
                    $work->root->recordId,
                    $counts,
                ),
            );
    }
}
