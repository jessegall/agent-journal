<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Events\HelperRecordFacts;
use App\Events\Hooks\HelperReportedOnRecord;
use App\Events\Hooks\HelperSentOnRecord;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Raises the facts of helpers sent on a record: a sending is staged in the caller's command, a report is dispatched
 * at once; each reaches every running stack with a state listening for it.
 */
final readonly class HelperRecordFactSender implements HelperRecordFacts
{
    public function __construct(
        private CommandFacts $facts,
        private Dispatcher $events,
    ) {}

    public function sent(RecordIdentity $subject, string $agentId): void
    {
        $this->facts->publishAfterCommit(new HelperSentOnRecord($subject, $agentId));
    }

    public function reported(RecordIdentity $subject, string $agentId): void
    {
        $this->events->dispatch(new HelperReportedOnRecord($subject, $agentId));
    }
}
