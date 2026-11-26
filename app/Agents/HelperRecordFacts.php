<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Contracts\Events\HelperRecordFacts as HelperRecordFactsContract;
use App\Bus\Contracts\CommandFacts;
use App\Events\Hooks\HelperAssigned;
use App\Events\Hooks\HelperFinishedOnRecord;
use App\Support\RecordIdentity;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Raises the facts of helpers sent on a record: a sending is staged in the caller's command, a finished job is dispatched
 * at once; each reaches every running stack with a state listening for it.
 */
final readonly class HelperRecordFacts implements HelperRecordFactsContract
{
    public function __construct(
        private CommandFacts $facts,
        private Dispatcher $events,
    ) {}

    public function assigned(RecordIdentity $subject, string $agentId): void
    {
        $this->facts->publishAfterCommit(new HelperAssigned($subject, $agentId));
    }

    public function finished(RecordIdentity $subject, string $agentId): void
    {
        $this->events->dispatch(new HelperFinishedOnRecord($subject, $agentId));
    }
}
