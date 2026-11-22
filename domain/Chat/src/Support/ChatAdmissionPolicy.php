<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\ChatEligibility;
use App\Actors\Enums\ActorType;
use App\Actors\Enums\ChatPermission;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\AgentChatAdmission;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Support\ChatInboxes;
use Domain\Chat\Models\Conversation;

/**
 * Who may bring whom into a chat: one check of the inviter and the target together, shared by candidate search and
 * by the add itself. The inviter must be a member of the chat and hold the manage permission in its environment; the
 * target must be a user admitted there who may receive invitations, or an agent its operator allowed this inviter to
 * bring there, and not a member yet.
 */
final readonly class ChatAdmissionPolicy
{
    public const int CANDIDATE_LIMIT = 50;

    public function __construct(
        private ChatEligibility $eligibility,
        private AgentChatAdmission $agents,
        private ChatInboxes $chats,
        private InboxResolver $inboxes,
    ) {}

    public function mayCreate(ActorIdentity $creator, string|null $environmentId): bool
    {
        return $this->eligibility->holds($creator, ChatPermission::CreateChats, $environmentId);
    }

    public function mayAdd(ActorIdentity $inviter, ActorIdentity $target, Conversation $chat): bool
    {
        if (! $this->mayInvite($inviter, $chat) || $this->isMember($target, $chat)) {
            return false;
        }

        return $target->type === ActorType::Agent
            ? $this->agents->mayJoin($target, $inviter, $chat->environment_id)
            : $this->eligibility->holds($target, ChatPermission::ReceiveInvitations, $chat->environment_id);
    }

    /**
     * The users and agents the inviter may add to the chat, for candidate search; none when it may invite nobody.
     *
     * @return list<ActorIdentity>
     */
    public function candidates(ActorIdentity $inviter, Conversation $chat): array
    {
        if (! $this->mayInvite($inviter, $chat)) {
            return [];
        }

        $users = array_map(
            fn (string $userId) => new ActorIdentity(ActorType::User, $userId),
            $this->eligibility->invitableUserIds($chat->environment_id, self::CANDIDATE_LIMIT),
        );
        $agents = array_map(
            fn (string $agentId) => new ActorIdentity(ActorType::Agent, $agentId),
            $this->agents->invitableAgentIds($inviter, $chat->environment_id, self::CANDIDATE_LIMIT),
        );

        return array_values(array_filter(
            [...$users, ...$agents],
            fn (ActorIdentity $candidate) => ! $this->isMember($candidate, $chat),
        ));
    }

    private function mayInvite(ActorIdentity $inviter, Conversation $chat): bool
    {
        return $chat->isOpen()
            && $this->isMember($inviter, $chat)
            && $this->eligibility->holds($inviter, ChatPermission::ManageMembers, $chat->environment_id);
    }

    private function isMember(ActorIdentity $actor, Conversation $chat): bool
    {
        return $this->chats->isActiveMember($this->inboxes->resolve($chat->inbox_id), $actor);
    }
}
