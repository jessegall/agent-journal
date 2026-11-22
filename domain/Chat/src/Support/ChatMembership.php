<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Contracts\Chat\ChatDepartures;
use App\Contracts\Chat\ChatEligibility;
use App\Contracts\Chat\Inbox;
use App\Contracts\Chat\InboxResolver;
use App\Enums\IntervalRole;
use App\Enums\LeaveReason;
use App\Support\ActorIdentity;
use App\Support\AgentChatAdmission;
use App\Support\ChatInboxes;
use App\Support\ChatInterval;
use App\Support\InboxIntervals;
use App\Support\InboxMembers;
use Carbon\CarbonImmutable;
use Domain\Chat\Exceptions\ChatMembershipRefused;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\DirectChat;
use Illuminate\Support\Str;

/**
 * Who is in a chat, changed under its locks: the target's admission first, then the chat inbox; every rule is checked
 * again once both are held. Only the owner adds, removes, hands over and closes; any member may leave, except the
 * owner while others remain. Users and agents mix freely, up to a hundred members.
 */
final readonly class ChatMembership
{
    public function __construct(
        private ChatEligibility $eligibility,
        private AgentChatAdmission $agents,
        private ChatAdmissionPolicy $policy,
        private InboxResolver $inboxes,
        private ChatInboxes $chats,
        private InboxIntervals $intervals,
        private ChatDepartures $departures,
    ) {}

    /**
     * Opens a group chat owned by the creator, which must hold the create permission, and adds each user through the
     * same rules as any later addition. Answers the chat's inbox id.
     *
     * @param  list<ActorIdentity>  $members
     *
     * @throws ChatMembershipRefused
     */
    public function createGroup(ActorIdentity $creator, string $title, array $members): string
    {
        if (! $this->policy->mayCreate($creator, null)) {
            throw ChatMembershipRefused::mayNotCreate();
        }

        $providerId = strtolower((string) Str::ulid());
        $inboxId = $this->chats->open($providerId);
        Conversation::create($inboxId, $providerId, $creator, null, $title);
        $this->intervals->enter(new ChatInbox($inboxId, $title), $creator, IntervalRole::Owner);

        foreach ($members as $member) {
            $this->add($creator, $inboxId, $member);
        }

        return $inboxId;
    }

    /**
     * Adds the target as a member; adding someone already in the chat changes nothing.
     *
     * @throws ChatMembershipRefused
     */
    public function add(ActorIdentity $actor, string $inboxId, ActorIdentity $target): void
    {
        $conversation = Conversation::forInbox($inboxId);
        $this->lockAdmissionOf($target, $conversation->environment_id);
        $inbox = $this->locked($conversation);
        $this->assertOwner($actor, $conversation);

        if ($this->chats->isActiveMember($inbox, $target)) {
            return;
        }

        $members = $this->chats->activeIntervals($inbox);

        if (count($members) >= InboxMembers::LIMIT) {
            throw ChatMembershipRefused::rosterFull($inboxId, InboxMembers::LIMIT);
        }

        if (! $this->policy->mayAdd($actor, $target, $conversation)) {
            throw ChatMembershipRefused::notEligible($inboxId);
        }

        DirectChat::findFor($conversation)?->remove();
        $this->intervals->enter($inbox, $target, IntervalRole::Member);
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

    /**
     * Locks what admits the target first: a user's account and grant, an agent's chat permission.
     */
    private function lockAdmissionOf(ActorIdentity $target, string|null $environmentId): void
    {
        if ($target->type->isAgent()) {
            $this->agents->lockPermission($target, $environmentId);

            return;
        }

        $this->eligibility->lockAdmission($target, $environmentId);
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
