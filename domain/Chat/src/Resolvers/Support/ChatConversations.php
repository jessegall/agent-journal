<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers\Support;

use App\Actors\Contracts\ActorLabels;
use App\Actors\Contracts\ChatEligibility;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ChatPermission;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\AgentDrivers;
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
use Domain\Chat\Data\ChatRowsPageData;
use Domain\Chat\Data\ChatSummaryData;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Data\ParticipantData;
use Domain\Chat\Data\QuestionActionsData;
use Domain\Chat\Data\ReplyTargetData;
use Domain\Chat\Data\SpeakerData;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Support\DockProjection;

/**
 * The chat window's conversation at one chat inbox, a pair or a group: its members with their names and
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
        private AgentDrivers $agentDrivers,
    ) {}

    public function pageFor(AgentOption|null $agent, string $inboxId, string|null $dockToken): ConversationData
    {
        $viewer = ActorIdentity::of($this->actors->actor());
        $intervals = $this->chats->activeIntervals($this->inboxes->resolve($inboxId));
        $members = array_map(fn (ChatInterval $interval) => $interval->actor, $intervals);
        $names = $this->labels->labelsFor($members);
        $drivers = $this->agentDrivers->driversOf($members);
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
     * One page of the chat's rows by speaker, the newest without a cursor or the page before the given one, at most
     * fifty, with the cursor of the page before it.
     */
    public function rowsPage(string $inboxId, string|null $olderCursor): ChatRowsPageData
    {
        $viewer = ActorIdentity::of($this->actors->actor());
        $intervals = $this->chats->activeIntervals($this->inboxes->resolve($inboxId));
        $members = array_map(fn (ChatInterval $interval) => $interval->actor, $intervals);
        $drivers = $this->agentDrivers->driversOf($members);
        $page = $this->messages->timeline($inboxId, $olderCursor, MessagePage::DEFAULT_LIMIT);
        $rows = array_map(fn (MessageView $message) => self::rowOf($message, $drivers, $viewer), $page->messages);

        return ChatRowsPageData::from([
            'messages' => $rows,
            'olderCursor' => $page->olderCursor,
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
     * The membership actions the viewer is offered: the owner's controls when it may manage members, and leaving
     * for anyone but an owner others still depend on.
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
        $hasOthers = count($intervals) > 1;

        return ChatCapabilitiesData::from([
            'add' => $manages,
            'remove' => $manages && $hasOthers,
            'transfer' => $isOwner && $hasOthers,
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
