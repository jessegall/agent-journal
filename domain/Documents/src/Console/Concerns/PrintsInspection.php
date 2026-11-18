<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Concerns;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Data\RecordInspection;
use Domain\Documents\Enums\EditingState;

/**
 * How doc:inspect and report:inspect print a record's state: editing, attention, settlements and draft closes.
 */
trait PrintsInspection
{
    use SendsRecordCalls;

    protected function showInspection(AgentRequestSender $journal, string $path): int
    {
        $reply = $this->sendSigned($journal, $path, ['number' => (string) $this->argument('number')]);

        if ($reply === null) {
            return self::FAILURE;
        }

        $inspection = RecordInspection::from($reply);
        $this->line($inspection->label);
        $this->line('Editing: '.($inspection->editing->state === EditingState::Free ? 'free' : "held by {$this->holderOf($inspection)}"));
        $this->line("Attention: {$inspection->attention->value}");

        foreach ($inspection->settlements as $settlement) {
            $this->line("  settled {$settlement->settledAt} by {$settlement->actorType} {$settlement->actorId}: {$settlement->reason}");
        }

        foreach ($inspection->links as $link) {
            $this->line("  linked to {$link->label}: {$link->title}");
        }

        foreach ($inspection->closes as $close) {
            $this->line("  draft closed {$close->closedAt} ({$close->cause}), revision {$close->baseRevision} to {$close->resultRevision}".($close->reason === null ? '' : ": {$close->reason}"));
        }

        return self::SUCCESS;
    }

    private function holderOf(RecordInspection $inspection): string
    {
        return is_string($inspection->editing->holder) ? $inspection->editing->holder : 'you';
    }
}
