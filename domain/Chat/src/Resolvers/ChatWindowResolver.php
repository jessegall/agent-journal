<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\AgentDirectory;
use App\Agents\Support\AgentOption;
use App\Communication\Contracts\ActorInboxResolver;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Contracts\InboxDestinationResolver;
use App\Communication\Data\MessagePage;
use App\Records\Contracts\RecordResolver;
use App\Ui\Contracts\PageResolver;
use Domain\Chat\Data\ChatData;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Resolvers\Support\DockedRecordRecords;
use Domain\Chat\Support\ConversationPair;
use Spatie\LaravelData\Optional;

/**
 * The chat window, on Home and on its own page: every agent the user can see, idle ones included, the chosen one
 * (the main agent unless the query names another) and its conversation, which is there with or without a session.
 * An agent out of sight is refused like a missing one.
 */
final readonly class ChatWindowResolver implements PageResolver
{
    public function __construct(
        private ConversationRequest $request,
        private AgentDirectory $agents,
        private ConversationResolver $messages,
        private CurrentActor $actors,
        private ActorInboxResolver $ownInboxes,
        private InboxDestinationResolver $destinations,
        private DockedRecordRecords $docked,
        private RecordResolver $records,
    ) {}

    public function read(): ChatData
    {
        $agents = $this->agents->visible();
        $main = $this->agents->mainAgentId();
        $chosen = $this->request->chosenAgent()->orElse($main)->map($this->agents->visibleAgent(...));

        return ChatData::from([
            'agents' => $agents,
            'setupRequired' => $main->isEmpty(),
            'selectedAgentId' => $chosen
                ->map(fn (AgentOption $agent) => $agent->agentId)
                ->getOrElse(Optional::create()),
            'conversation' => $chosen->map($this->conversationWith(...))->getOrElse(Optional::create()),
        ]);
    }

    private function conversationWith(AgentOption $agent): ConversationData
    {
        $actorInboxId = $this->ownInboxes->preferredFor($this->actors->actor())->inboxId();
        $agentInboxId = $this->destinations->resolve($agent->assignee)->inboxId();
        $page = $this->messages->between($actorInboxId, $agentInboxId, null, MessagePage::DEFAULT_LIMIT);

        $conversationPair = new ConversationPair($actorInboxId, $agentInboxId);
        $docked = $this->records->visibleCards($this->docked->docked($conversationPair));

        return ConversationData::fromPage($actorInboxId, $agentInboxId, $page, $agent, $docked);
    }
}
