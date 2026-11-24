<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers\Support;

use App\Contracts\Actors\ActorLabels;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Chat\ChatEligibility;
use App\Contracts\Chat\ChatLines;
use App\Contracts\Chat\ConversationResolver;
use App\Contracts\Chat\InboxResolver;
use App\Data\Messages\DeliveryView;
use App\Data\Messages\InboxView;
use App\Data\Messages\MessagePage;
use App\Data\Messages\MessageView;
use App\Enums\ChatPermission;
use App\Enums\MessageState;
use App\Resolvers\Support\ChatDeliveries;
use App\Support\ActorIdentity;
use App\Support\AgentDrivers;
use App\Support\AgentOption;
use App\Support\ChatInboxes;
use App\Support\ChatInterval;
use App\Values\ChatLine;
use Domain\Chat\Data\ChatCapabilitiesData;
use Domain\Chat\Data\ChatLineData;
use Domain\Chat\Data\ChatMessageData;
use Domain\Chat\Data\ChatRowsPageData;
use Domain\Chat\Data\ChatSummaryData;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Data\DeliveryData;
use Domain\Chat\Data\ParticipantData;
use Domain\Chat\Data\ReactionData;
use Domain\Chat\Data\ReplyTargetData;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\MessageReaction;
use Domain\Chat\Support\DockProjection;
use Spatie\LaravelData\Optional;

/**
 * The chat window's conversation at one chat inbox, a pair or a group: its members with their names and
 * drivers, its newest rows by speaker from the timeline, the viewer's unread count and what is docked there.
 */
final readonly class ChatConversations
{
    public function __construct(
        private CurrentActor $actors,
        private ConversationResolver $messages,
        private ChatLines $lines,
        private InboxResolver $inboxes,
        private ChatInboxes $chats,
        private ActorLabels $labels,
        private DockProjection $dock,
        private ChatEligibility $eligibility,
        private AgentDrivers $agentDrivers,
        private ChatDeliveries $deliveries,
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
        $rows = $this->rowsOf($page->messages, $drivers, $viewer);

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
            'lines' => $this->linesFrom($inboxId, $rows, $page->olderCursor === null),
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
        $rows = $this->rowsOf($page->messages, $drivers, $viewer);

        return ChatRowsPageData::from([
            'messages' => $rows,
            'lines' => $this->linesFrom($inboxId, $rows, $page->olderCursor === null),
            'olderCursor' => $page->olderCursor,
        ]);
    }

    /**
     * The plain lines from a page's first message on, or from the chat's start when the page reaches it; the browser
     * keeps each line once by its position, so pages that overlap show it once, between the messages around it.
     *
     * @param  list<ChatMessageData>  $rows
     * @return list<ChatLineData>
     */
    private function linesFrom(string $inboxId, array $rows, bool $reachesStart): array
    {
        $from = $reachesStart || $rows === [] ? 0 : $rows[0]->sequence;

        $lines = $this->lines->linesFrom($inboxId, $from);
        $sources = [];

        foreach ($lines as $line) {
            if ($line->source !== null) {
                $sources["line-{$line->sequence}"] = $line->source;
            }
        }

        $cards = $this->dock->cardsOf($sources);

        return array_map(
            fn (ChatLine $line) => ChatLineData::fromChatLine($line, $cards["line-{$line->sequence}"] ?? null),
            $lines,
        );
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
     * The rows by speaker; the rows the viewer wrote, or every row for an operator, carry how far each woken
     * recipient got, and an operator is offered the retry of one given up.
     *
     * @param  list<MessageView>  $messages
     * @param  array<string, string|null>  $drivers
     * @return list<ChatMessageData>
     */
    private function rowsOf(array $messages, array $drivers, ActorIdentity $viewer): array
    {
        $operates = $this->actors->authority()->mayRunApplicationCommands();

        $tracked = array_values(array_map(
            fn (MessageView $message) => $message->id,
            array_filter(
                $messages,
                fn (MessageView $message) => $operates
                    || "{$message->authorType}:{$message->authorId}" === self::keyOf($viewer),
            ),
        ));

        $deliveries = $this->deliveries->forMessages($tracked);

        $recipients = array_merge([], ...array_map(
            fn (array $views) => array_map(fn (DeliveryView $view) => $view->recipient, $views),
            array_values($deliveries),
        ));

        $names = $this->labels->labelsFor($recipients);

        $reactions = self::reactionsByMessage(
            MessageReaction::toMessages(array_map(fn (MessageView $message) => $message->id, $messages)),
            $viewer,
        );

        return array_map(fn (MessageView $message) => self::rowOf(
            $message,
            $drivers,
            $viewer,
            $reactions[$message->id] ?? [],
            array_map(fn (DeliveryView $view) => DeliveryData::from([
                'recipient' => self::keyOf($view->recipient),
                'label' => $names->nameOf($view->recipient) ?? self::keyOf($view->recipient),
                'state' => $view->state,
                'reason' => $view->reason,
                'pendingFrom' => $view->pendingFrom,
                'rangeId' => $operates ? $view->exhaustedRangeId : null,
            ]), $deliveries[$message->id] ?? []),
        ), $messages);
    }

    /**
     * @param  array<string, string|null>  $drivers
     * @param  list<ReactionData>  $reactions
     * @param  list<DeliveryData>  $deliveries
     */
    private static function rowOf(
        MessageView $message,
        array $drivers,
        ActorIdentity $viewer,
        array $reactions,
        array $deliveries,
    ): ChatMessageData {
        $speaker = "{$message->authorType}:{$message->authorId}";

        $respondent = $message->respondentType === null
            ? null
            : "{$message->respondentType}:{$message->respondentId}";

        $settles = $message->state === MessageState::WaitingForAnswer && $respondent === self::keyOf($viewer);

        return ChatMessageData::from([
            'id' => $message->id,
            'sequence' => (int) $message->sequence,
            'rootId' => $message->userRootId,
            'speaker' => [
                'actor' => $speaker,
                'label' => $message->authorLabel ?? $speaker,
                'driver' => $drivers[$speaker] ?? null,
            ],
            'addressedTo' => $message->addresseeType === null
                ? null
                : "{$message->addresseeType}:{$message->addresseeId}",
            'replyTo' => self::replyTargetOf($message),
            'body' => $message->body,
            'state' => $message->state,
            'stateVersion' => $message->stateVersion,
            'respondent' => $respondent,
            'actions' => [
                'answer' => $settles,
                'decline' => $settles,
                'retryDelivery' => array_any($deliveries, fn (DeliveryData $delivery) => $delivery->rangeId !== null),
            ],
            'readByMe' => $message->shownToViewer,
            'sentAt' => $message->sentAt,
            'requestKey' => $message->requestKey,
            'deliveries' => $deliveries,
            'reactions' => $reactions,
        ]);
    }

    /**
     * The reactions of each message, one per emoji in the order first used, counted, with whether the viewer is among
     * them.
     *
     * @param  list<MessageReaction>  $reactions
     * @return array<string, list<ReactionData>>
     */
    private static function reactionsByMessage(array $reactions, ActorIdentity $viewer): array
    {
        $grouped = [];

        foreach ($reactions as $reaction) {
            $held = $grouped[$reaction->message_id][$reaction->emoji] ?? ['count' => 0, 'isMine' => false];

            $grouped[$reaction->message_id][$reaction->emoji] = [
                'count' => $held['count'] + 1,
                'isMine' => $held['isMine'] || $reaction->owningActor()->isSameAs($viewer),
            ];
        }

        return array_map(fn (array $emojis) => array_map(
            fn (string $emoji, array $tally) => ReactionData::from(['emoji' => $emoji, ...$tally]),
            array_keys($emojis),
            $emojis,
        ), $grouped);
    }

    private static function replyTargetOf(MessageView $message): ReplyTargetData|Optional
    {
        if ($message->replyToId === null && ! $message->replyUnavailable) {
            return Optional::create();
        }

        return ReplyTargetData::from(['id' => $message->replyToId, 'visible' => ! $message->replyUnavailable]);
    }

    private static function keyOf(ActorIdentity $actor): string
    {
        return "{$actor->type->value}:{$actor->id}";
    }
}
