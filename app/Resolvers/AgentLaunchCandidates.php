<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Sessions\LaunchCandidates;
use App\Enums\LaunchCandidateRank;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\ConversationVisit;
use App\Models\Drivers\DriverConversation;
use App\Models\Reviews\WorkReservation;
use App\Models\Starts\ProcessStart;
use App\Support\LaunchCandidateFacts;
use App\Support\LaunchCandidateQuery;
use App\Support\RankedLaunchCandidate;

/**
 * Ranks an owner's helpers from Agents' own records: the agent row, its running sessions and unresolved starts, and
 * the conversations it kept under the purpose with the model of each one's last visit. An actor with no agent row is
 * never offered, nor is one whose certified work is held for review.
 */
final readonly class AgentLaunchCandidates implements LaunchCandidates
{
    public function rank(LaunchCandidateQuery $query): array
    {
        $helpers = array_values(array_filter(
            $query->helpers,
            fn (LaunchCandidateFacts $helper) => ! $helper->hasOpenWork,
        ));

        $agentIds = array_map(fn (LaunchCandidateFacts $helper) => $helper->actor->id, $helpers);
        $agents = Agent::byIds($agentIds);
        $busy = [...$this->busyAgents($agentIds), ...WorkReservation::reservedAgentIds($agentIds)];

        $purposeConversations = DriverConversation::query()
            ->whereIn('agent_id', $agentIds)
            ->where('context_reference', $query->purposeReference)
            ->readAll('every conversation the offered helpers kept under one purpose, to prove exposure')
            ->get();

        $exactAgents = $this->agentsLastOnModel(
            $purposeConversations->where('resume_protocol', $query->driver)->all(),
            $query->model,
        );

        $sawPurpose = $purposeConversations->pluck('agent_id')->unique()->all();

        $ranked = [];

        foreach ($helpers as $helper) {
            $agent = $agents[$helper->actor->id] ?? null;

            $eligible = $agent instanceof Agent
                && ! $agent->isRetired()
                && $agent->profile_key === $query->profile->key
                && ! in_array($agent->id, $busy, true);

            if (! $eligible) {
                continue;
            }

            $ranked[] = [
                $helper,
                new RankedLaunchCandidate(
                    $helper->actor,
                    $this->rankOf($helper, in_array($agent->id, $exactAgents, true)),
                    in_array($agent->id, $sawPurpose, true),
                ),
            ];
        }

        usort($ranked, fn (array $first, array $second) => self::compare($first, $second));

        return array_map(fn (array $pair) => $pair[1], $ranked);
    }

    private function rankOf(LaunchCandidateFacts $helper, bool $isLastOnExactModel): LaunchCandidateRank
    {
        if (! $helper->hasDoneThisPurpose) {
            return LaunchCandidateRank::OtherPurpose;
        }

        if ($isLastOnExactModel) {
            return LaunchCandidateRank::ExactConversation;
        }

        return LaunchCandidateRank::SamePurpose;
    }

    /**
     * The agents with a running or silent session or a start nobody resolved yet: none of them can take new work.
     *
     * @param  list<string>  $ids
     * @return list<string>
     */
    private function busyAgents(array $ids): array
    {
        $running = AgentSession::query()
            ->whereIn('agent_id', $ids)
            ->running()
            ->readAll('the running sessions of the offered helpers')
            ->pluck('agent_id')
            ->all();

        $starting = ProcessStart::query()
            ->whereIn('agent_id', $ids)
            ->unresolved()
            ->readAll('the unresolved starts of the offered helpers')
            ->pluck('agent_id')
            ->all();

        return array_values(array_unique([
            ...$running,
            ...$starting,
        ]));
    }

    /**
     * The agents whose conversation's last visit ran on the model.
     *
     * @param  array<int, DriverConversation>  $conversations
     * @return list<string>
     */
    private function agentsLastOnModel(array $conversations, string $model): array
    {
        $owners = [];

        foreach ($conversations as $conversation) {
            $owners[$conversation->id] = $conversation->agent_id;
        }

        $lastVisits = ConversationVisit::query()
            ->whereIn('conversation_id', array_keys($owners))
            ->orderByDesc('observed_at')
            ->readAll('the visits of the offered helpers\' conversations under one purpose, to find each last one')
            ->get()
            ->unique('conversation_id');

        $models = AgentSession::query()
            ->whereIn('id', $lastVisits->pluck('session_id')->all())
            ->readAll('the sessions of those last visits')
            ->pluck('model', 'id');

        return array_values(array_unique($lastVisits
            ->filter(fn (ConversationVisit $visit) => $models[$visit->session_id] === $model)
            ->map(fn (ConversationVisit $visit) => $owners[$visit->conversation_id])
            ->all()));
    }

    /**
     * Better rank first, then the latest finished ranking work, then the lower actor id.
     *
     * @param  array{LaunchCandidateFacts, RankedLaunchCandidate}  $first
     * @param  array{LaunchCandidateFacts, RankedLaunchCandidate}  $second
     */
    private static function compare(array $first, array $second): int
    {
        [$firstFacts, $firstCandidate] = $first;
        [$secondFacts, $secondCandidate] = $second;

        return [
            $firstCandidate->rank->value,
            -($firstFacts->rankingFinish()?->getTimestampMs() ?? PHP_INT_MIN + 1),
            $firstCandidate->actor->id,
        ] <=> [
            $secondCandidate->rank->value,
            -($secondFacts->rankingFinish()?->getTimestampMs() ?? PHP_INT_MIN + 1),
            $secondCandidate->actor->id,
        ];
    }
}
