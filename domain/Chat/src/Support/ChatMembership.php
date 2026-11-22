<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\ChatEligibility;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Enums\IntervalRole;
use App\Communication\Enums\LeaveReason;
use App\Communication\Support\ChatDepartures;
use App\Communication\Support\ChatInboxes;
use App\Communication\Support\ChatInterval;
use App\Communication\Support\InboxIntervals;
use App\Communication\Support\InboxMembers;
use Carbon\CarbonImmutable;
use Domain\Chat\Exceptions\ChatMembershipRefused;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\DirectChat;

/**
 * Who is in a chat, changed under its locks: the target's admission first, then the chat inbox; every rule is checked
 * again once both are held. Only the owner adds, removes, hands over and closes; any member may leave, except the
 * owner while others remain. An agent chat stays a pair.
 */
final readonly class ChatMembership
{
    public function __construct(
        private ChatEligibility $eligibility,
        private ChatAdmissionPolicy $policy,
        private InboxResolver $inboxes,
        private ChatInboxes $chats,
        private InboxIntervals $intervals,
        private ChatDepartures $departures,
    ) {}

    /**
     * Adds the target as a member; adding someone already in the chat changes nothing.
     *
     * @throws ChatMembershipRefused
     */
    public function add(ActorIdentity $actor, string $inboxId, ActorIdentity $target): void
    {
        $conversation = Conversation::forInbox($inboxId);
        $this->eligibility->lockAdmission($target, $conversation->environment_id);
        $inbox = $this->locked($conversation);
        $this->assertOwner($actor, $conversation);

        if ($this->chats->isActiveMember($inbox, $target)) {
            return;
        }

        $members = $this->chats->activeIntervals($inbox);

        if ($target->type->isAgent()) {
            throw ChatMembershipRefused::agentInUserGroup($inboxId);
        }

        if (array_any($members, fn (ChatInterval $member) => $member->actor->type->isAgent())) {
            throw ChatMembershipRefused::agentChat($inboxId);
        }

        if (count($members) >= InboxMembers::LIMIT) {
            throw ChatMembershipRefused::rosterFull($inboxId, InboxMembers::LIMIT);
        }

        if (! $this->policy->mayAdd($actor, $target, $conversation)) {
            throw ChatMembershipRefused::notEligible($inboxId);
        }

        DirectChat::removeFor($conversation);
        $this->intervals->join($inbox, $target, IntervalRole::Member);
    }

    /**
     * @throws ChatMembershipRefused
     */
    public function remove(ActorIdentity $actor, string $inboxId, ActorIdentity $target): void
    {
        $conversation = Conversation::forInbox($inboxId);
        $this->eligibility->lockAdmission($target, $conversation->environment_id);
        $inbox = $this->locked($conversation);
        $this->assertOwner($actor, $conversation);

        if ($target->isSameAs($actor)) {
            throw ChatMembershipRefused::lastOwner($inboxId);
        }

        $this->departures->depart($this->intervalOf($inbox, $target), LeaveReason::Removed);
    }

    /**
     * The actor leaves; the owner may only leave a chat nobody else is in, which closes it.
     *
     * @throws ChatMembershipRefused
     */
    public function leave(ActorIdentity $actor, string $inboxId): void
    {
        $conversation = Conversation::forInbox($inboxId);
        $inbox = $this->locked($conversation);
        $interval = $this->intervalOf($inbox, $actor);

        if (! $conversation->isOwnedBy($actor)) {
            $this->departures->depart($interval, LeaveReason::Left);

            return;
        }

        if (count($this->chats->activeIntervals($inbox)) > 1) {
            throw ChatMembershipRefused::lastOwner($inboxId);
        }

        $this->closeLocked($conversation, $inbox, $actor);
    }

    /**
     * Hands the chat to another member: it gets the owner's controls and the actor loses them in the same commit.
     *
     * @throws ChatMembershipRefused
     */
    public function transfer(ActorIdentity $actor, string $inboxId, ActorIdentity $target): void
    {
        $conversation = Conversation::forInbox($inboxId);
        $this->eligibility->lockAdmission($target, $conversation->environment_id);
        $inbox = $this->locked($conversation);
        $this->assertOwner($actor, $conversation);
        $to = $this->intervalOf($inbox, $target);

        if ($target->type->isAgent() || ! $this->eligibility->isAdmitted($target, $conversation->environment_id)) {
            throw ChatMembershipRefused::notEligible($inboxId);
        }

        $this->intervals->transfer($this->intervalOf($inbox, $actor), $to);
        $conversation->transferTo($target);
    }

    /**
     * @throws ChatMembershipRefused
     */
    public function close(ActorIdentity $actor, string $inboxId): void
    {
        $conversation = Conversation::forInbox($inboxId);
        $inbox = $this->locked($conversation);
        $this->assertOwner($actor, $conversation);
        $this->closeLocked($conversation, $inbox, $actor);
    }

    private function closeLocked(Conversation $conversation, Inbox $inbox, ActorIdentity $actor): void
    {
        $this->departures->closeChat($inbox, $actor);
        $conversation->close(CarbonImmutable::now());
    }

    private function locked(Conversation $conversation): Inbox
    {
        $inbox = $this->inboxes->resolve($conversation->inbox_id);
        $this->inboxes->accessFor($inbox)->lockExclusive($inbox);

        return $inbox;
    }

    /**
     * @throws ChatMembershipRefused
     */
    private function assertOwner(ActorIdentity $actor, Conversation $conversation): void
    {
        if (! $conversation->isOwnedBy($actor)) {
            throw ChatMembershipRefused::notOwner($conversation->inbox_id);
        }
    }

    /**
     * @throws ChatMembershipRefused
     */
    private function intervalOf(Inbox $inbox, ActorIdentity $actor): ChatInterval
    {
        if (! $this->chats->isActiveMember($inbox, $actor)) {
            throw ChatMembershipRefused::notMember($inbox->inboxId());
        }

        return $this->chats->activeInterval($inbox, $actor);
    }
}
