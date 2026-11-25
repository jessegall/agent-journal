<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers\Support;

use App\Contracts\Actors\ActorLabels;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Inboxes\InboxEligibility;
use App\Contracts\Messages\MessageParticipant;
use App\Enums\ActorType;
use App\Enums\InboxPermission;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use App\Models\Messages\MessageReadEntry;
use App\Support\ActorIdentity;
use App\Support\AgentDrivers;
use App\Support\AgentOption;
use App\Support\Cards\DockIdentity;
use App\Support\MessageParticipants;
use Domain\Chat\Data\ChatCapabilitiesData;
use Domain\Chat\Data\ChatEntryData;
use Domain\Chat\Data\ChatRowsPageData;
use Domain\Chat\Data\ChatSummaryData;
use Domain\Chat\Data\ConversationData;
use Domain\Chat\Data\ParticipantData;
use Domain\Chat\Enums\ChatMessageType;
use Domain\Chat\Models\ChatMessage;
use Domain\Chat\Support\ChatInboxes;
use Domain\Chat\Support\DockProjection;
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
    ) {}

    public function pageFor(AgentOption|null $agent, Inbox $inbox, string|null $dockToken): ConversationData
    {
        $viewer = ActorIdentity::of($this->actors->actor());
        $members = [
            ...InboxMember::attachedTo([$inbox->id], ActorType::User),
            ...InboxMember::attachedTo([$inbox->id], ActorType::Agent),
        ];
        $names = $this->labels->labelsFor($members);
        $drivers = $this->agentDrivers->driversOf($members);
        $capabilities = $this->capabilitiesOf($viewer, $inbox, count($members));
        $page = $this->entriesBefore($inbox->id, null);

        return ConversationData::from([
            'inboxId' => $inbox->id,
            'label' => $inbox->label,
            'agentId' => $agent?->agentId,
            'sessionId' => $agent?->sessionId,
            'sessionGeneration' => $agent === null ? 0 : $agent->sessionGeneration,
            'viewer' => $viewer->text(),
            'participants' => array_map(fn (ActorIdentity $member) => ParticipantData::from([
                'actor' => $member->text(),
                'label' => $names->nameOf($member) ?? $member->text(),
                'driver' => $drivers[$member->text()] ?? null,
            ]), $members),
            'canManageParticipants' => $capabilities->canAdd || $capabilities->canRemove,
            'capabilities' => $capabilities,
            'unreadCount' => Message::query()->inInbox($inbox->id)->unreadBy($this->viewerModel())->count(),
            'hasOlder' => $page->hasOlder,
            'entries' => $page->entries,
            'dock' => $this->dock->page($inbox, $dockToken),
        ]);
    }

    /**
     * Up to a page of entries before the entry named, oldest first; the newest page when none is named.
     */
    public function entriesBefore(string $inboxId, string|null $beforeId): ChatRowsPageData
    {
        $cursor = $beforeId === null ? null : ChatMessage::query()->ofInbox($inboxId)->findOrFail($beforeId);
        $rows = ChatMessage::query()
            ->pageBefore($inboxId, $cursor)
            ->withSource()
            ->limit(ChatMessage::PAGE_SIZE + 1)
            ->get();
        $shown = $rows->take(ChatMessage::PAGE_SIZE)->reverse()->values();

        return ChatRowsPageData::from([
            'entries' => $this->entriesOf($shown),
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
        $viewer = $this->viewerModel();

        return array_values($chats->map(fn (Inbox $inbox) => ChatSummaryData::from([
            'inboxId' => $inbox->id,
            'label' => $inbox->label,
            'unread' => Message::query()->inInbox($inbox->id)->unreadBy($viewer)->count(),
        ]))->all());
    }

    /**
     * @param  Collection<int, ChatMessage>  $rows
     * @return list<ChatEntryData>
     */
    private function entriesOf(Collection $rows): array
    {
        $authors = array_values($rows->map(fn (ChatMessage $row) => $row->author)->all());
        $names = $this->labels->labelsFor($authors);
        $events = $this->dock->cardsOf($rows
            ->filter(fn (ChatMessage $row) => $row->type === ChatMessageType::Event)
            ->mapWithKeys(fn (ChatMessage $row) => [$row->id => new DockIdentity($row->source_type, $row->source_id)])
            ->all());
        $viewer = ActorIdentity::of($this->actors->actor());
        $readIds = $this->readIdsAmong($rows);

        return array_values($rows->map(function (ChatMessage $row) use ($names, $events, $viewer, $readIds): ChatEntryData {
            $author = $row->author;

            return ChatEntryData::from([
                'id' => $row->id,
                'type' => $row->type,
                'groupNumber' => $row->group_number,
                'author' => $author->text(),
                'authorLabel' => $names->nameOf($author),
                'createdAt' => $row->created_at->toIso8601String(),
                ...self::sourceFieldsOf($row, $viewer, $readIds),
                ...($row->type === ChatMessageType::Event && isset($events[$row->id]) ? ['event' => $events[$row->id]] : []),
            ]);
        })->all());
    }

    /**
     * The messages among the rows the viewer has read.
     *
     * @param  Collection<int, ChatMessage>  $rows
     * @return list<string>
     */
    private function readIdsAmong(Collection $rows): array
    {
        $messageIds = $rows->where('source_type', Message::linkType())->pluck('source_id')->all();

        return array_values(array_map(strval(...), MessageReadEntry::query()
            ->whereReader($this->viewerModel())
            ->ofMessages($messageIds)
            ->pluck('message_id')
            ->all()));
    }

    /**
     * A group chat's members may be managed by a viewer holding the permission; a pair chat stays as it is.
     */
    private function capabilitiesOf(ActorIdentity $viewer, Inbox $inbox, int $memberCount): ChatCapabilitiesData
    {
        $isGroup = $inbox->provider_key === ChatInboxes::GROUP_PROVIDER;
        $manages = $isGroup && $this->eligibility->holds($viewer, InboxPermission::ManageMembers, null);

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
