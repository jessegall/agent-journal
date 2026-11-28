<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\CurrentActor;
use App\Agents\AgentInspection;
use App\Messages\Contracts\MessageParticipants;
use App\Models\Agents\Agent;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use App\Sessions\Contracts\AgentDirectory;
use App\Sessions\Contracts\ProfileResolver;
use App\Support\HomeAgent;
use App\Values\ProfileKey;
use Carbon\CarbonImmutable;
use Domain\Chat\Data\AgentOptionData;
use Domain\Chat\Data\AgentPageCursorData;
use Domain\Chat\Data\AgentPageData;
use Domain\Chat\Enums\ChatMessageType;
use Domain\Chat\Models\ChatMessage;
use Domain\Questions\Contracts\QuestionSummaryReader;
use Domain\Questions\Support\ShownQuestion;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * The chat list a page at a time: the agents the viewer may see, newest chat activity first, each with its status,
 * unread messages, last activity and waiting question, read for the page at once.
 */
final readonly class AgentListing
{
    /**
     * How many of the newest questions in the viewer's agent chats are looked at for one still waiting.
     */
    public const int QUESTIONS_READ = 100;

    /**
     * How many agents one page of the chat list holds.
     */
    public const int PAGE_SIZE = 20;

    public function __construct(
        private AgentDirectory $agents,
        private AgentInspection $inspection,
        private PairChats $chats,
        private CurrentActor $actors,
        private MessageParticipants $participants,
        private ProfileResolver $profiles,
        private QuestionSummaryReader $questions,
    ) {}

    /**
     * The first page, with each agent named after it that the page does not hold, such as the chosen one, so the chat
     * shown is listed.
     *
     * @param  list<string>  $shownAgentIds
     */
    public function firstPageWith(array $shownAgentIds): AgentPageData
    {
        $pairIds = $this->pairChatIds();
        $read = $this->rowsOf($this->ranked($pairIds)->limit(self::PAGE_SIZE + 1));
        $onPage = array_map(fn (RankedAgent $row) => $row->agentId, array_slice($read, 0, self::PAGE_SIZE));
        $missing = array_values(array_unique(array_diff($shownAgentIds, $onPage)));
        $extra = $missing === []
            ? []
            : $this->rowsOf($this->ranked($pairIds)->whereKey($missing)->limit(count($missing)));

        return $this->pageOf($read, $extra);
    }

    /**
     * The page that starts after the cursor, in the same order.
     */
    public function pageAfter(AgentPageCursorData $cursor): AgentPageData
    {
        $ranked = $this->ranked($this->pairChatIds());
        $lastActiveAt = $cursor->afterActiveAt;

        if ($lastActiveAt === null) {
            $ranked->whereNull('activity.last_active_at')->where('agents.id', '<', $cursor->afterAgentId);
        } else {
            $ranked->where(fn (Builder $after) => $after
                ->where('activity.last_active_at', '<', $lastActiveAt)
                ->orWhere(fn (Builder $tied) => $tied
                    ->where('activity.last_active_at', '=', $lastActiveAt)
                    ->where('agents.id', '<', $cursor->afterAgentId))
                ->orWhereNull('activity.last_active_at'));
        }

        return $this->pageOf($this->rowsOf($ranked->limit(self::PAGE_SIZE + 1)), []);
    }

    /**
     * The page of the rows read, one past the page telling a next page exists, with the extra rows after it.
     *
     * @param  list<RankedAgent>  $read
     * @param  list<RankedAgent>  $extra
     */
    private function pageOf(array $read, array $extra): AgentPageData
    {
        $shown = array_slice($read, 0, self::PAGE_SIZE);
        $next = null;

        if (count($read) > self::PAGE_SIZE) {
            $last = $shown[self::PAGE_SIZE - 1];
            $next = AgentPageCursorData::from([
                'afterAgentId' => $last->agentId,
                'afterActiveAt' => $last->lastActiveAt,
            ]);
        }

        return AgentPageData::from(['agents' => $this->optionsOf([...$shown, ...$extra]), 'next' => $next]);
    }

    /**
     * @param  list<RankedAgent>  $rows
     * @return list<AgentOptionData>
     */
    private function optionsOf(array $rows): array
    {
        $byAgent = array_column(array_map(fn (RankedAgent $row) => [$row->agentId, $row], $rows), 1, 0);
        $agents = $this->agents->visibleAmong(array_keys($byAgent));
        $inboxIds = array_values(array_filter(array_map(fn (RankedAgent $row) => $row->inboxId, $rows)));
        $unread = $this->unreadIn($inboxIds);
        $waiting = $this->waitingIn($inboxIds);
        $mainProfiles = $this->mainProfilesAmong($agents);
        $designated = $this->agents->mainAgentId()->getOrElse(null);

        return array_map(function (HomeAgent $agent) use (
            $byAgent,
            $unread,
            $waiting,
            $mainProfiles,
            $designated,
        ): AgentOptionData {
            $row = $byAgent[$agent->agentId];

            return AgentOptionData::from($agent, new AgentChatActivity(
                $agent->agentId === $designated || in_array($agent->profileKey, $mainProfiles, true),
                $unread[$row->inboxId] ?? 0,
                $row->lastActiveAt === null ? null : CarbonImmutable::parse($row->lastActiveAt),
                in_array($row->inboxId, $waiting, true),
            ));
        }, $agents);
    }

    /**
     * The agents the viewer may see, each with its chat with the viewer and when that chat last moved, the most
     * recently moved first, those never moved last, and by id within one time.
     *
     * @param  list<string>  $pairIds
     * @return Builder<Agent>
     */
    private function ranked(array $pairIds): Builder
    {
        $members = InboxMember::query()->ofInboxes($pairIds)->ofActorType(Agent::storedType())->active()
            ->select(['actor_id', 'inbox_id'])
            ->limit(InboxMember::ATTACHED_LIMIT);
        $activity = ChatMessage::query()->ofInboxes($pairIds)
            ->groupBy('inbox_id')
            ->selectRaw('inbox_id, max(created_at) as last_active_at')
            ->limit(count($pairIds));

        return $this->inspection->agentsSeenBy($this->actors->actor())
            ->leftJoinSub($members, 'members', 'members.actor_id', '=', 'agents.id')
            ->leftJoinSub($activity, 'activity', 'activity.inbox_id', '=', 'members.inbox_id')
            ->select(['agents.id', 'members.inbox_id', 'activity.last_active_at'])
            ->orderByRaw('activity.last_active_at desc nulls last')
            ->orderByDesc('agents.id');
    }

    /**
     * @param  Builder<Agent>  $ranked
     * @return list<RankedAgent>
     */
    private function rowsOf(Builder $ranked): array
    {
        return array_values($ranked->toBase()->get()->map(fn (object $row) => new RankedAgent(
            strval($row->id),
            $row->inbox_id === null ? null : strval($row->inbox_id),
            $row->last_active_at === null ? null : strval($row->last_active_at),
        ))->all());
    }

    /**
     * The viewer's chats of two, each the chat with one agent.
     *
     * @return list<string>
     */
    private function pairChatIds(): array
    {
        return array_values(array_map(strval(...), $this->chats->joined()
            ->withProviderKey(PairChats::PAIR_PROVIDER)
            ->limit(InboxMember::ATTACHED_LIMIT)
            ->pluck('id')
            ->all()));
    }

    /**
     * @param  list<string>  $inboxIds
     * @return array<string, int>
     */
    private function unreadIn(array $inboxIds): array
    {
        return Message::unreadCountsIn($inboxIds, $this->participants->reader($this->actors->actor()));
    }

    /**
     * The chats in which a question to the viewer is still open.
     *
     * @param  list<string>  $inboxIds
     * @return list<string>
     */
    private function waitingIn(array $inboxIds): array
    {
        $viewer = $this->actors->actor();
        $questionIds = array_values(array_map(strval(...), ChatMessage::query()->ofInboxes($inboxIds)
            ->ofType(ChatMessageType::Question)
            ->latest('created_at')
            ->limit(self::QUESTIONS_READ)
            ->pluck('source_id')
            ->all()));

        $open = new Collection($this->questions->shownByIds($questionIds))->filter(
            fn (ShownQuestion $question) => $question->answer === null
                && $question->targetType === $viewer->type
                && $question->targetId === $viewer->id,
        );

        return array_values($open->map(fn (ShownQuestion $question) => $question->inboxId)->unique()->all());
    }

    /**
     * The profile keys among the agents whose profile coordinates the journal's work; a profile that is gone is none.
     *
     * @param  list<HomeAgent>  $agents
     * @return list<string>
     */
    private function mainProfilesAmong(array $agents): array
    {
        $keys = array_values(array_unique(array_map(fn (HomeAgent $agent) => $agent->profileKey, $agents)));

        return array_values(array_filter($keys, function (string $key): bool {
            $profile = ProfileKey::from($key);

            return $this->profiles->has($profile) && $this->profiles->snapshotFor($profile)->base->isCoordinator();
        }));
    }
}
