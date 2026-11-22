<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Actors\Support\ActorIdentity;
use App\Agents\Models\AgentSession;
use App\Bus\Contracts\CommandFacts;
use App\Hooks\Contracts\HelperRecordFacts;
use App\Hooks\Events\HelperReportedOnRecord;
use App\Hooks\Events\HelperSentOnRecord;
use App\Hooks\StateEvents\StateEventScope;
use App\Hooks\Support\StackTransaction;
use App\Records\Support\RecordIdentity;
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
