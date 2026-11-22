<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Models\ClaimAuthorization;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Communication\Commands\RequireMessageAnswer;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Exceptions\AnswerImpossible;
use App\Communication\Exceptions\ChatMessageRefused;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Exceptions\MessageStateConflict;
use App\Communication\Models\Message;
use App\Contracts\CommandHandler;

final readonly class RequireMessageAnswerHandler implements CommandHandler
{
    public function __construct(
        private InboxResolver $inboxes,
        private ResponsibilityWriter $responsibilities,
    ) {}

    /**
     * Only the author asks; asking again while the message waits changes nothing, and a closed message stays closed.
     *
     * @throws MessageMissing
     * @throws MessageStateConflict
     * @throws AnswerImpossible
     */
    public function handle(RequireMessageAnswer $command): void
    {
        $message = Message::lockedById($command->messageId);
        $author = ActorIdentity::of($command->dispatchedBy());

        if (! $message->isWrittenBy($author)) {
            throw MessageMissing::forId($command->messageId);
        }

        if ($message->isChat()) {
            throw ChatMessageRefused::conversion($message->id);
        }

        if ($message->needsReply()) {
            return;
        }

        $destination = $this->inboxes->resolve($message->destination_inbox_id);

        if ($this->inboxes->membersOf($destination) === []) {
            throw AnswerImpossible::forInbox($destination->inboxId());
        }

        $message->requireAnswer();
        $this->claimForFirstReader($message);
    }

    /**
     * The first reader takes the answer up when the exact seat it read through still holds it; otherwise the message
     * waits unclaimed in its inbox.
     */
    private function claimForFirstReader(Message $message): void
    {
        $reader = $message->firstReader();
        $seatId = $message->read_participation_assignment_id;
        $seatHolder = $seatId === null ? null : (AssignmentRecord::holdersOf([$seatId])[$seatId] ?? null);

        $readerStillSeated = $reader !== null
            && $seatHolder?->isSameAs(AssigneeIdentity::ofActorIdentity($reader)) === true;

        if (! $readerStillSeated) {
            return;
        }

        $claim = $this->responsibilities->assign($message->assignmentIdentity(), $seatHolder);
        ClaimAuthorization::forInbox($claim->reference, new AssignmentReference((string) $seatId, $seatHolder));
    }
}
