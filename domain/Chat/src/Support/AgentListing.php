<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Contracts\CurrentActor;
use App\Messages\Contracts\MessageParticipants;
use App\Models\Agents\Agent;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use App\Sessions\Contracts\AgentDirectory;
use App\Sessions\Contracts\ProfileResolver;
use App\Support\AgentOption;
use App\Values\ProfileKey;
use Carbon\CarbonImmutable;
use Domain\Chat\Data\AgentOptionData;
use Domain\Chat\Enums\ChatMessageType;
use Domain\Chat\Models\ChatMessage;
use Domain\Questions\Contracts\QuestionSummaryReader;
use Domain\Questions\Support\ShownQuestion;
use Illuminate\Support\Collection;

/**
 * The agents the chat list shows, each with its status and its chat with the viewer: unread messages, last activity
 * and a question waiting for the viewer, read for every agent at once; a main agent is one the designation names or
 * whose profile coordinates the journal's work.
 */
final readonly class AgentListing
{
    /**
     * How many of the newest questions in the viewer's agent chats are looked at for one still waiting.
     */
    public const int QUESTIONS_READ = 100;

    public function __construct(
        private AgentDirectory $agents,
        private PairChats $chats,
        private CurrentActor $actors,
        private MessageParticipants $participants,
        private ProfileResolver $profiles,
        private QuestionSummaryReader $questions,
    ) {}

    /**
     * @return list<AgentOptionData>
     */
    public function visible(): array
    {
        $agents = $this->agents->visible();
        $inboxes = $this->agentChatsOf();
        $inboxIds = array_values($inboxes);
        $unread = $this->unreadIn($inboxIds);
        $lastActive = $this->lastActivityIn($inboxIds);
        $waiting = $this->waitingIn($inboxIds);
        $mainProfiles = $this->mainProfilesAmong($agents);
        $designated = $this->agents->mainAgentId()->getOrElse(null);

        return array_map(function (AgentOption $agent) use (
            $inboxes,
            $unread,
            $lastActive,
            $waiting,
            $mainProfiles,
            $designated,
        ): AgentOptionData {
            $inboxId = $inboxes[$agent->agentId] ?? null;

            return AgentOptionData::from($agent, new AgentChatActivity(
                $agent->agentId === $designated || in_array($agent->profileKey, $mainProfiles, true),
                $unread[$inboxId] ?? 0,
                $lastActive[$inboxId] ?? null,
                in_array($inboxId, $waiting, true),
            ));
        }, $agents);
    }

    /**
     * The viewer's chat with each agent, by agent id.
     *
     * @return array<string, string>
     */
    private function agentChatsOf(): array
    {
        $pairIds = array_values(array_map(strval(...), $this->chats->joined()
            ->withProviderKey(PairChats::PAIR_PROVIDER)
            ->limit(InboxMember::ATTACHED_LIMIT)
            ->pluck('id')
            ->all()));

        return InboxMember::query()->ofInboxes($pairIds)->ofActorType(Agent::storedType())->active()
            ->limit(InboxMember::ATTACHED_LIMIT)
            ->pluck('inbox_id', 'actor_id')
            // A collection hands the key too, which strval refuses as a second argument.
            ->map(fn (mixed $inboxId) => strval($inboxId))
            ->all();
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
     * @param  list<string>  $inboxIds
     * @return array<string, CarbonImmutable>
     */
    private function lastActivityIn(array $inboxIds): array
    {
        return ChatMessage::query()->ofInboxes($inboxIds)
            ->groupBy('inbox_id')
            ->selectRaw('inbox_id, max(created_at) as last_active_at')
            ->limit(count($inboxIds))
            ->toBase()
            ->pluck('last_active_at', 'inbox_id')
            ->map(fn (string $time) => CarbonImmutable::parse($time))
            ->all();
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
     * @param  list<AgentOption>  $agents
     * @return list<string>
     */
    private function mainProfilesAmong(array $agents): array
    {
        $keys = array_values(array_unique(array_map(fn (AgentOption $agent) => $agent->profileKey, $agents)));

        return array_values(array_filter($keys, function (string $key): bool {
            $profile = ProfileKey::from($key);

            return $this->profiles->has($profile) && $this->profiles->snapshotFor($profile)->base->isCoordinator();
        }));
    }
}
