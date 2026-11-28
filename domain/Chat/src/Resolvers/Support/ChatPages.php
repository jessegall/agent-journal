<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers\Support;

use App\Actors\Contracts\ActorLabels;
use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\AgentDrivers;
use App\Inboxes\Contracts\InboxEligibility;
use App\Messages\Contracts\MessageParticipant;
use App\Messages\Contracts\MessageParticipants;
use App\Messages\Enums\InboxPermission;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRunningTool;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use App\Models\Messages\MessageReadEntry;
use App\Support\ActorReference;
use App\Support\HomeAgent;
use App\Web\Data\RunningCommandData;
use Domain\Chat\Data\ChatCapabilitiesData;
use Domain\Chat\Data\ChatEntryData;
use Domain\Chat\Data\ChatRowsPageData;
use Domain\Chat\Data\ChatSummaryData;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Data\MessageEntryData;
use Domain\Chat\Data\ParticipantData;
use Domain\Chat\Data\QuestionEntryData;
use Domain\Chat\Enums\ChatMessageType;
use Domain\Chat\Enums\DeliveryStatus;
use Domain\Chat\Models\ChatMessage;
use Domain\Chat\Support\AgentStartLog;
use Domain\Chat\Support\Cards\DockIdentity;
use Domain\Chat\Support\DockProjection;
use Domain\Chat\Support\PairChats;
use Domain\Questions\Contracts\QuestionSummaryReader;
use Domain\Questions\Support\ShownQuestion;
use Illuminate\Database\Eloquent\Collection as ModelCollection;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Collection;

/**
 * What a chat window reads: one chat's members, capabilities and newest entries, a page of older entries, and the
 * chats the viewer is in. Reading changes no read state.
 */
final readonly class ChatPages
{
    public function __construct(
        private CurrentActor $actors,
        private ActorLabels $labels,
        private AgentDrivers $agentDrivers,
        private DockProjection $dock,
        private InboxEligibility $eligibility,
        private MessageParticipants $participants,
        private QuestionSummaryReader $questions,
        private AgentStartLog $startLog,
    ) {}

    public function pageFor(HomeAgent|null $agent, Inbox $inbox, string|null $dockToken): ConversationData
    {
        $viewer = $this->actors->actor();

        $members = [
            ...InboxMember::resolveAttachedTo([$inbox->id], User::class),
            ...InboxMember::resolveAttachedTo([$inbox->id], Agent::class),
        ];

        $names = $this->labels->labelsFor($members);
        $drivers = $this->agentDrivers->driversOf($members);
        $capabilities = $this->capabilitiesOf($viewer, $inbox, count($members));
        $reader = $this->viewerModel();
        $page = $this->entriesOfPage($inbox->id, null, $reader);

        return ConversationData::from([
            'inboxId' => $inbox->id,
            'label' => $inbox->label,
            'agentId' => $agent?->agentId,
            'sessionId' => $agent?->sessionId,
            'sessionGeneration' => $agent === null ? 0 : $agent->sessionGeneration,
            'viewer' => $viewer->text(),
            'participants' => array_map(fn (ActorReference $member) => ParticipantData::from([
                'actor' => $member->text(),
                'label' => $names->nameOf($member) ?? $member->text(),
                'driver' => $drivers[$member->text()] ?? null,
            ]), $members),
            'canManageParticipants' => $capabilities->canAdd || $capabilities->canRemove,
            'capabilities' => $capabilities,
            'unreadCount' => Message::query()->inInbox($inbox->id)->unreadBy($reader)->count(),
            'hasOlder' => $page->hasOlder,
            'entries' => $page->entries,
            'dock' => $this->dock->page($inbox, $dockToken),
            'runningCommand' => $agent === null ? null : $this->runningCommandOf($agent),
            'debugLines' => $agent === null ? [] : $this->startLog->newestStartLines($agent->agentId),
        ]);
    }

    /**
     * The tool call the agent's chat line names now, the seed the pushed changes follow; none before its first call.
     */
    private function runningCommandOf(HomeAgent $agent): RunningCommandData|null
    {
        return AgentRunningTool::shownOf($agent->agentId)
            ->map(fn (AgentRunningTool $tool) => RunningCommandData::from($tool))
            ->getOrElse(null);
    }

    /**
     * Up to a page of entries before the entry named, oldest first; the newest page when none is named.
     */
    public function entriesBefore(string $inboxId, string|null $beforeId): ChatRowsPageData
    {
        return $this->entriesOfPage($inboxId, $beforeId, $this->viewerModel());
    }

    /**
     * Up to a page of entries before the entry named, as the reader sees them.
     */
    private function entriesOfPage(string $inboxId, string|null $beforeId, MessageParticipant $reader): ChatRowsPageData
    {
        $cursor = $beforeId === null ? null : ChatMessage::query()->ofInbox($inboxId)->findOrFail($beforeId);

        $rows = ChatMessage::query()
            ->pageBefore($inboxId, $cursor)
            ->withSource()
            ->limit(ChatMessage::PAGE_SIZE + 1)
            ->get();

        $shown = $rows->take(ChatMessage::PAGE_SIZE)->reverse()->values();

        return ChatRowsPageData::from([
            'entries' => $this->entriesOf($shown, $reader),
            'hasOlder' => $rows->count() > ChatMessage::PAGE_SIZE,
        ]);
    }

    /**
     * The chats the viewer is attached to, as the chat selector lists them, each with its unread count.
     *
     * @param  Collection<int, Inbox>  $chats
     * @return list<ChatSummaryData>
     */
    public function summariesOf(Collection $chats): array
    {
        $inboxIds = array_values($chats->map(fn (Inbox $inbox) => $inbox->id)->all());
        $unread = Message::unreadCountsIn($inboxIds, $this->viewerModel());

        return array_values($chats->map(fn (Inbox $inbox) => ChatSummaryData::from([
            'inboxId' => $inbox->id,
            'label' => $inbox->label,
            'unread' => $unread[$inbox->id] ?? 0,
        ]))->all());
    }

    /**
     * @param  ModelCollection<int, ChatMessage>  $rows
     * @return list<ChatEntryData>
     */
    private function entriesOf(ModelCollection $rows, MessageParticipant $reader): array
    {
        $authors = array_values($rows->map(fn (ChatMessage $row) => $row->author)->all());
        $names = $this->labels->labelsFor($authors);

        $events = $this->dock->cardsOf($rows
            ->filter(fn (ChatMessage $row) => $row->type === ChatMessageType::Event)
            ->mapWithKeys(fn (ChatMessage $row) => [$row->id => new DockIdentity($row->source_type, $row->source_id)])
            ->all());

        $viewer = $this->actors->actor();
        $readIds = $this->readIdsAmong($rows, $reader);
        $readByOthers = $this->readByOthersAmong($rows, $reader);
        $questions = $this->questionsAmong($rows);
        $rows->load(['source' => fn (MorphTo $source) => $source->morphWith([Message::class => ['target']])]);

        return array_values($rows->map(function (
            ChatMessage $row,
        ) use ($names, $events, $viewer, $readIds, $readByOthers, $questions): ChatEntryData {
            $author = $row->author;

            $fields = [
                'id' => $row->id,
                'type' => $row->type,
                'groupNumber' => $row->group_number,
                'author' => $author->text(),
                'authorLabel' => $names->nameOf($author),
                'createdAt' => $row->created_at->toIso8601String(),
                ...$this->sourceFieldsOf($row, $viewer, $readIds, $readByOthers, $questions),
            ];

            $event = $events[$row->id] ?? null;

            if ($row->type === ChatMessageType::Event && $event !== null) {
                $fields['event'] = $event;
            }

            return ChatEntryData::from($fields);
        })->all());
    }

    /**
     * The row's source as its card shows it: a message or a reaction by its message, a question by its question; an
     * event carries its card apart.
     *
     * @param  list<string>  $readIds
     * @param  list<string>  $readByOthers
     * @param  array<string, ShownQuestion>  $questions
     * @return array<string, MessageEntryData|QuestionEntryData>
     */
    private function sourceFieldsOf(
        ChatMessage $row,
        ActorReference $viewer,
        array $readIds,
        array $readByOthers,
        array $questions,
    ): array {
        if ($row->type === ChatMessageType::Question) {
            return ['question' => $this->questionEntryOf($questions[$row->source_id], $viewer)];
        }

        $message = $row->source;

        if (! $message instanceof Message) {
            return [];
        }

        return ['message' => MessageEntryData::from([
            'id' => $message->id,
            'number' => $message->number,
            'body' => $message->body,
            'targetMessageId' => $message->target_message_id,
            'targetNumber' => $message->target?->number,
            'isReadByViewer' => in_array($message->id, $readIds, true),
            'delivery' => DeliveryStatus::of($message, in_array($message->id, $readByOthers, true)),
            'deliveryFailure' => $message->delivery_failure,
        ])];
    }

    /**
     * A question's card: only its target may answer it, and only while it has no answer.
     */
    private function questionEntryOf(ShownQuestion $question, ActorReference $viewer): QuestionEntryData
    {
        $target = ActorReference::fromStored($question->targetType, $question->targetId);

        return QuestionEntryData::from([
            'id' => $question->id,
            'text' => $question->text,
            'type' => $question->type,
            'options' => $question->options,
            'target' => $target->text(),
            'answer' => $question->answer,
            'canAnswer' => $question->answer === null && $target->isSameAs($viewer),
        ]);
    }

    /**
     * The questions among the rows, by id.
     *
     * @param  Collection<int, ChatMessage>  $rows
     * @return array<string, ShownQuestion>
     */
    private function questionsAmong(Collection $rows): array
    {
        $ids = array_values(array_map(
            strval(...),
            $rows->where('type', ChatMessageType::Question)->pluck('source_id')->all(),
        ));

        $questions = [];

        foreach ($this->questions->shownByIds($ids) as $question) {
            $questions[$question->id] = $question;
        }

        return $questions;
    }

    /**
     * The messages among the rows the viewer has read.
     *
     * @param  Collection<int, ChatMessage>  $rows
     * @return list<string>
     */
    private function readIdsAmong(Collection $rows, MessageParticipant $reader): array
    {
        $messageIds = $rows->where('source_type', Message::linkType())->pluck('source_id')->all();

        return array_values(array_map(strval(...), MessageReadEntry::query()
            ->ofReader($reader)
            ->ofMessages($messageIds)
            ->pluck('message_id')
            ->all()));
    }

    /**
     * The messages among the rows another member read or answered, which counts as reading.
     *
     * @param  Collection<int, ChatMessage>  $rows
     * @return list<string>
     */
    private function readByOthersAmong(Collection $rows, MessageParticipant $reader): array
    {
        $messageIds = array_values(array_map(
            strval(...),
            $rows->where('source_type', Message::linkType())->pluck('source_id')->all(),
        ));

        $read = MessageReadEntry::query()->ofMessages($messageIds)->notOfReader($reader)->pluck('message_id')->all();
        $answered = Message::query()->answering($messageIds)->whereNotSender($reader)->pluck('target_message_id')->all();

        return array_values(array_unique(array_map(strval(...), [...$read, ...$answered])));
    }

    /**
     * A group chat's members may be managed by a viewer holding the permission; a pair chat stays as it is.
     */
    private function capabilitiesOf(ActorReference $viewer, Inbox $inbox, int $memberCount): ChatCapabilitiesData
    {
        $isGroup = $inbox->provider_key === PairChats::GROUP_PROVIDER;
        $manages = $isGroup && $this->eligibility->holds($viewer, InboxPermission::ManageMembers);

        return ChatCapabilitiesData::from([
            'canAdd' => $manages,
            'canRemove' => $manages && $memberCount > 1,
            'canTransfer' => $isGroup,
            'canLeave' => $isGroup,
            'canClose' => $manages,
        ]);
    }

    private function viewerModel(): MessageParticipant
    {
        return $this->participants->reader($this->actors->actor());
    }
}
