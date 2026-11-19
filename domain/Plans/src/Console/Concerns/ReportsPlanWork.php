<?php

declare(strict_types=1);

namespace Domain\Plans\Console\Concerns;

use App\AgentRequests\Values\CommandReport;
use Domain\Plans\Http\Data\PlanWorkResultData;

/**
 * Reports what a cascade over a plan or phase changed: one line, or the whole answer as JSON with --json.
 */
trait ReportsPlanWork
{
    protected function workReport(PlanWorkResultData $work): CommandReport
    {
        if ($this->option('json') === true) {
            $json = json_encode($work->toArray(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);

            return CommandReport::ending(self::SUCCESS)->line($json);
        }

        $counts = "{$work->changed} changed, {$work->unchanged} unchanged, {$work->skipped} skipped as finished";

        return CommandReport::ending(self::SUCCESS)
            ->line("Cascade over {$work->root->recordType} {$work->root->recordId} and its unfinished work: "
                ."{$counts}.");
    }
}
