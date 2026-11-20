<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\SessionResolver;
use App\Agents\Support\SessionOption;
use App\Assignments\Support\AssigneeIdentity;
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
use PhpOption\Option;
use Spatie\LaravelData\Optional;

/**
 * The chat window, on Home and on its own page: the agent sessions the user can talk to now, and the conversation
 * with the chosen one when it is still active.
 */
final readonly class ChatWindowResolver implements PageResolver
{
    public function __construct(
        private ConversationRequest $request,
        private SessionResolver $sessions,
        private ConversationResolver $messages,
        private CurrentActor $actors,
        private ActorInboxResolver $ownInboxes,
        private InboxDestinationResolver $destinations,
        private DockedRecordRecords $docked,
        private RecordResolver $records,
    ) {}

    public function read(): ChatData
    {
        $sessions = $this->sessions->active();
        $chosen = $this->request->chosenSession()->flatMap(
            fn (string $sessionId) => Option::fromArraysValue(
                array_values(
                    array_filter($sessions, fn (SessionOption $session) => $session->sessionId === $sessionId),
                ),
                0,
            ),
        );

        return ChatData::from([
            'sessions' => array_map(
                fn (SessionOption $session) => [
                    'id' => (string) $session->sessionId,
                    'agentName' => $session->agentName,
                ],
                $sessions,
            ),
            'conversation' => $chosen->map($this->conversationIn(...))->getOrElse(Optional::create()),
        ]);
    }

    private function conversationIn(SessionOption $session): ConversationData
    {
        $actorInboxId = $this->ownInboxes->preferredFor($this->actors->actor())->inboxId();
        $agent = AssigneeIdentity::ofActorIdentity($session->target->actorIdentity());
        $agentInboxId = $this->destinations->resolve($agent)->inboxId();
        $page = $this->messages->between($actorInboxId, $agentInboxId, null, MessagePage::DEFAULT_LIMIT);

        $docked = $this->records->visibleCards($this->docked->docked(new ConversationPair($actorInboxId, $agentInboxId)));

        return ConversationData::fromPage($actorInboxId, $agentInboxId, $page, (string) $session->sessionId, $docked);
    }
}
