<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Events\HelperRecordFacts;
use App\Events\HelperReportedOnRecord;
use App\Events\HelperSentOnRecord;
use App\Models\AgentSession;
use App\Support\StateEvents\StateEventScope;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Raises the facts of helpers sent on a record: a sending is staged in the caller's command, a report is dispatched
 * under the stack transaction of the parent's live session, so that parent's states hear it as their own.
 */
final readonly class HelperRecordFactSender implements HelperRecordFacts
{
    public function __construct(
        private CommandFacts $facts,
        private StackTransaction $transaction,
        private StateEventScope $eventScope,
        private Dispatcher $events,
    ) {}

    public function sent(RecordIdentity $subject, string $agentId): void
    {
        $this->facts->publishAfterCommit(new HelperSentOnRecord($subject, $agentId));
    }

    public function reported(ActorIdentity $parent, RecordIdentity $subject, string $agentId): void
    {
        $session = AgentSession::liveOf($parent->id);

        if ($session === null) {
            return;
        }

        $target = $session->target();
        $fact = new HelperReportedOnRecord($subject, $agentId);

        $this->transaction->runForTargets(
            [$target],
            fn () => $this->eventScope->admit([$target], fn () => $this->events->dispatch($fact)),
        );
    }
}
