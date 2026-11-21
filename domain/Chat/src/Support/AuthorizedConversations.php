<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\AgentDirectory;
use App\Agents\Exceptions\StackTargetRefused;
use App\Communication\Contracts\ActorInboxResolver;
use App\Communication\Contracts\InboxDestinationResolver;
use App\Communication\Exceptions\InboxUnavailable;
use Domain\Chat\Exceptions\ConversationUnavailable;

/**
 * The conversation the current actor holds with one agent it may see: its own inbox and the agent's. Two inbox ids
 * alone never authorize, and every refusal reads the same, before any placement or source is looked up.
 */
final readonly class AuthorizedConversations
{
    public function __construct(
        private CurrentActor $actors,
        private AgentDirectory $agents,
        private ActorInboxResolver $ownInboxes,
        private InboxDestinationResolver $destinations,
    ) {}

    /**
     * @throws ConversationUnavailable
     */
    public function withAgent(string $agentId): ConversationPeers
    {
        try {
            $agent = $this->agents->visibleAgent($agentId);

            return new ConversationPeers(
                $this->ownInboxes->preferredFor($this->actors->actor())->inboxId(),
                $this->destinations->resolve($agent->assignee)->inboxId(),
            );
        } catch (StackTargetRefused|InboxUnavailable $refused) {
            throw ConversationUnavailable::withPeer($refused);
        }
    }
}
