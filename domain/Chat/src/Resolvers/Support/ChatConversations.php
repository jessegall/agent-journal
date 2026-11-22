<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers\Support;

use App\Actors\Contracts\ActorLabels;
use App\Actors\Contracts\ChatEligibility;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ChatPermission;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\AgentOption;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Data\InboxView;
use App\Communication\Data\MessagePage;
use App\Communication\Data\MessageView;
use App\Communication\Enums\MessageState;
use App\Communication\Support\ChatInboxes;
use App\Communication\Support\ChatInterval;
use Domain\Chat\Data\ChatCapabilitiesData;
use Domain\Chat\Data\ChatMessageData;
use Domain\Chat\Data\ChatSummaryData;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Data\ParticipantData;
use Domain\Chat\Data\QuestionActionsData;
use Domain\Chat\Data\ReplyTargetData;
use Domain\Chat\Data\SpeakerData;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Support\DockProjection;

/**
 * The chat window's conversation with one agent, read at the pair's chat inbox: its members with their names and
 * drivers, its newest rows by speaker from the timeline, the viewer's unread count and what is docked there.
 */
final readonly class ChatConversations
{
    public function __construct(
        private CurrentActor $actors,
        private ConversationResolver $messages,
        private InboxResolver $inboxes,
        private ChatInboxes $chats,
        private ActorLabels $labels,
        private DockProjection $dock,
        private ChatEligibility $eligibility,
    ) {}

    public function pageFor(AgentOption|null $agent, string $inboxId, string|null $dockToken): ConversationData
    {
        $viewer = ActorIdentity::of($this->actors->actor());
        $intervals = $this->chats->activeIntervals($this->inboxes->resolve($inboxId));
        $names = $this->labels->labelsFor(array_map(fn (ChatInterval $interval) => $interval->actor, $intervals));
        $drivers = $agent === null
            ? []
            : [self::keyOf(new ActorIdentity(ActorType::Agent, $agent->agentId)) => $agent->sessionDriver];
        $conversation = Conversation::forInbox($inboxId);
        $capabilities = $this->capabilitiesOf($viewer, $conversation, $intervals);
        $page = $this->messages->timeline($inboxId, null, MessagePage::DEFAULT_LIMIT);
        $rows = array_map(fn (MessageView $message) => self::rowOf($message, $drivers, $viewer), $page->messages);

        return ConversationData::from([
            'inboxId' => $inboxId,
            'agentId' => $agent?->agentId,
            'sessionId' => $agent?->sessionId,
            'sessionGeneration' => $agent === null ? 0 : $agent->sessionGeneration,
            'viewer' => self::keyOf($viewer),
            'participants' => array_map(fn (ChatInterval $interval) => ParticipantData::from([
                'actor' => self::keyOf($interval->actor),
                'label' => $names->nameOf($interval->actor) ?? self::keyOf($interval->actor),
                'driver' => $drivers[self::keyOf($interval->actor)] ?? null,
                'role' => $interval->role,
            ]), $intervals),
            'canManageParticipants' => $capabilities->add || $capabilities->remove,
            'capabilities' => $capabilities,
            'latestSequence' => $rows === [] ? 0 : $rows[array_key_last($rows)]->sequence,
            'unreadCount' => $this->messages->counts($inboxId)->unread,
            'olderCursor' => $page->olderCursor,
            'messages' => $rows,
            'dock' => $this->dock->page($conversation, $dockToken),
        ]);
    }

    /**
     * The viewer's own inboxes that are chats, as the inbox selector lists them.
     *
     * @param  list<InboxView>  $inboxes
     * @return list<ChatSummaryData>
     */
    public function summariesFor(array $inboxes): array
    {
        $chatInboxIds = Conversation::query()
            ->whereIn('inbox_id', array_map(fn (InboxView $inbox) => $inbox->inboxId, $inboxes))
            ->pluck('inbox_id')
            ->all();

        return array_values(array_map(fn (InboxView $inbox) => ChatSummaryData::from([
            'inboxId' => $inbox->inboxId,
            'label' => $inbox->label,
            'unread' => $inbox->counts->unread,
        ]), array_filter($inboxes, fn (InboxView $inbox) => in_array($inbox->inboxId, $chatInboxIds, true))));
    }

    /**
     * The membership actions the viewer is offered: the owner's controls when it may manage members, adding only to a
     * chat without an agent, and leaving for anyone but an owner others still depend on.
     *
     * @param  list<ChatInterval>  $intervals
     */
    private function capabilitiesOf(
        ActorIdentity $viewer,
        Conversation $conversation,
        array $intervals,
    ): ChatCapabilitiesData {
        $isOwner = $conversation->isOpen() && $conversation->isOwnedBy($viewer);
        $manages = $isOwner
            && $this->eligibility->holds($viewer, ChatPermission::ManageMembers, $conversation->environment_id);
        $hasAgent = array_any($intervals, fn (ChatInterval $interval) => $interval->actor->type->isAgent());
        $hasOthers = count($intervals) > 1;

        return ChatCapabilitiesData::from([
            'add' => $manages && ! $hasAgent,
            'remove' => $manages && $hasOthers && ! $hasAgent,
            'transfer' => $isOwner && $hasOthers && ! $hasAgent,
            'leave' => $conversation->isOpen() && (! $isOwner || ! $hasOthers),
            'close' => $isOwner,
        ]);
    }

    /**
     * @param  array<string, string|null>  $drivers
     */
    private static function rowOf(MessageView $message, array $drivers, ActorIdentity $viewer): ChatMessageData
    {
        $speaker = "{$message->authorType}:{$message->authorId}";
        $respondent = $message->respondentType === null
            ? null
            : "{$message->respondentType}:{$message->respondentId}";
        $settles = $message->state === MessageState::WaitingForAnswer && $respondent === self::keyOf($viewer);

        return ChatMessageData::from([
            'id' => $message->id,
            'sequence' => (int) $message->sequence,
            'rootId' => $message->userRootId,
            'speaker' => SpeakerData::from([
                'actor' => $speaker,
                'label' => $message->authorLabel ?? $speaker,
                'driver' => $drivers[$speaker] ?? null,
            ]),
            'addressedTo' => $message->addresseeType === null
                ? null
                : "{$message->addresseeType}:{$message->addresseeId}",
            'replyTo' => self::replyTargetOf($message),
            'body' => $message->body,
            'state' => $message->state,
            'stateVersion' => $message->stateVersion,
            'respondent' => $respondent,
            'actions' => QuestionActionsData::from(['answer' => $settles, 'decline' => $settles]),
            'readByMe' => $message->shownToViewer,
            'sentAt' => $message->sentAt,
            'requestKey' => $message->requestKey,
        ]);
    }

    private static function replyTargetOf(MessageView $message): ReplyTargetData|null
    {
        if ($message->replyToId === null && ! $message->replyUnavailable) {
            return null;
        }

        return ReplyTargetData::from(['id' => $message->replyToId, 'visible' => ! $message->replyUnavailable]);
    }

    private static function keyOf(ActorIdentity $actor): string
    {
        return "{$actor->type->value}:{$actor->id}";
    }
}
