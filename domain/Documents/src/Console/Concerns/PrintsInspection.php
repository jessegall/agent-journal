<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Concerns;

use App\Values\CommandReport;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Enums\EditingState;

/**
 * How doc:inspect and report:inspect print a record's state: editing, attention, settlements and draft closes.
 */
trait PrintsInspection
{
    protected function inspectionReport(RecordInspection $inspection): CommandReport
    {
        $editing = $inspection->editing->state === EditingState::Free
            ? 'free'
            : "held by {$this->holderOf($inspection)}";

        $report = CommandReport::ending(self::SUCCESS)
            ->line($inspection->label)
            ->line("Editing: {$editing}")
            ->line("Attention: {$inspection->attention->value}");

        foreach ($inspection->settlements as $settlement) {
            $actorLabel = "{$settlement->actorType} {$settlement->actorId}";
            $report = $report->line("  settled {$settlement->settledAt} by {$actorLabel}: {$settlement->reason}");
        }

        foreach ($inspection->links as $link) {
            $report = $report->line("  linked to {$link->label}: {$link->title}");
        }

        foreach ($inspection->closes as $close) {
            $reason = $close->reason === null ? '' : ": {$close->reason}";
            $revisions = "revision {$close->baseRevision} to {$close->resultRevision}";
            $report = $report->line("  draft closed {$close->closedAt} ({$close->cause}), {$revisions}{$reason}");
        }

        return $report;
    }

    private function holderOf(RecordInspection $inspection): string
    {
        if (is_string($inspection->editing->holder)) {
            return $inspection->editing->holder;
        }

        return 'you';
    }
}
