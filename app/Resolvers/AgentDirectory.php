<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Access\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\CurrentActor;
use App\Agents\AgentInspection;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Enums\AccessType;
use App\Agents\Enums\AgentAction;
use App\Agents\Enums\AgentPresence;
use App\Agents\ResumableConversation;
use App\Exceptions\StackTargetRefused;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Agents\MainAgentDesignation;
use App\Models\Drivers\DriverConversation;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\DriverSwitch;
use App\Models\Projects\HostDriverImageWait;
use App\Models\Sessions\SessionOutcomeDismissal;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Policies\AgentPolicy;
use App\Projects\Contracts\AgentProjects;
use App\Sessions\Contracts\AgentDirectory as AgentDirectoryContract;
use App\Sessions\SessionStartOutcome;
use App\Sessions\StartRemedyWords;
use App\Support\AgentFacts;
use App\Support\AgentStatusDecision;
use App\Support\HomeAgent;
use App\Time\Contracts\ServerClock;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use PhpOption\Option;

/**
 * Reads the agents for Home in a fixed number of queries: the agents, their running sessions and runtimes, the
 * refusals of their starts, their latest start outcomes the viewer has not dismissed, their latest switches and their
 * latest conversations, each for every shown agent at once.
 */
final readonly class AgentDirectory implements AgentDirectoryContract, AgentProjects
{
    /**
     * How many agents Home lists; more agents than this is not a working setup.
     */
    public const int AGENTS_SHOWN = 50;

    /**
     * How many conversations Home offers to resume per agent.
     */
    public const int CONVERSATIONS_SHOWN = 5;

    public function __construct(
        private CurrentActor $actors,
        private AgentInspection $inspection,
        private StartRemedyWords $remedyWords,
        private ServerClock $clock,
        private CurrentAuthorizer $authorizer,
    ) {}

    public function visible(): array
    {
        return $this->optionsOf($this->seen()->byCreatedAt()->limit(self::AGENTS_SHOWN)->get());
    }

    public function visibleAmong(array $ids): array
    {
        $positions = array_flip($ids);
        $found = $this->seen()->whereKey($ids)->limit(count($ids))->get();

        return $this->optionsOf($found->sortBy(fn (Agent $agent) => $positions[$agent->id])->values());
    }

    public function visibleAgent(string $agentId): HomeAgent
    {
        $found = $this->visibleAmong([$agentId]);

        if ($found === []) {
            throw StackTargetRefused::forTarget("agent {$agentId}");
        }

        return $found[0];
    }

    /**
     * The agents the actor may see, as a query to order and bound.
     *
     * @return Builder<Agent>
     */
    private function seen(): Builder
    {
        return $this->inspection->agentsSeenBy($this->actors->actor());
    }

    /**
     * Each agent's option, its facts read for every one of them at once.
     *
     * @param  EloquentCollection<int, Agent>  $agents
     * @return list<HomeAgent>
     */
    private function optionsOf(EloquentCollection $agents): array
    {
        $ids = $agents->modelKeys();

        $sessions = AgentSession::query()->ofAgents($ids)->running()
            ->limit(self::AGENTS_SHOWN)->get()->keyBy('agent_id');

        $sessionIds = array_values($sessions->map(fn (AgentSession $session): string => $session->id)->all());

        $runtimes = AgentRuntime::query()->ofSessions($sessionIds)
            ->limit(self::AGENTS_SHOWN)->get()->keyBy('agent_session_id');

        $starts = SessionProcess::query()->supervised()->ofSessions($sessionIds)
            ->newestFirst()->limit(self::AGENTS_SHOWN * 2)->get()->unique('session_id')
            ->keyBy('session_id');

        // The starts that wait for their host's driver image, read once for every agent shown.
        $imageWaits = HostDriverImageWait::query()
            ->ofStarts(array_values(array_map(strval(...), $starts->pluck('id')->all())))
            ->pluck('session_process_id')->all();

        $requests = DriverRequest::query()->ofAgentRuntimes($runtimes->pluck('id')->all())
            ->bySequenceDescending()->limit(self::AGENTS_SHOWN * 2)->get()->unique('agent_runtime_id')
            ->keyBy('agent_runtime_id');

        $waitingOnHelpers = AgentRuntime::resolveSessionsWaitingOnHelpers(array_values(array_map(
            strval(...),
            $sessions->pluck('id')->all(),
        )));

        $readiness = SessionRequest::resolveLatestReadinessOf(array_values(array_map(
            strval(...),
            $sessions->pluck('id')->all(),
        )));

        $canStop = $this->authorizer->filterActions(AgentPolicy::class, Agent::class, [AccessType::Edit]) !== [];

        $switches = DriverSwitch::query()->ofAgents($ids)->newestCreatedFirst()
            ->limit(self::AGENTS_SHOWN * 2)->get()->unique('agent_id')->keyBy('agent_id');

        $refusals = SessionProcess::resolveRefusalsOf(array_values(array_map(strval(...), $ids)));

        $startOutcomes = $this->startOutcomesOf(array_values(array_map(strval(...), $ids)));

        $conversations = DriverConversation::query()->ofAgents($ids)->newestCreatedFirst()
            ->limit(self::AGENTS_SHOWN * self::CONVERSATIONS_SHOWN)->get()->groupBy('agent_id');

        $now = $this->clock->now();

        return array_values($agents->map(function (Agent $agent) use (
            $now,
            $sessions,
            $runtimes,
            $starts,
            $requests,
            $switches,
            $conversations,
            $refusals,
            $startOutcomes,
            $waitingOnHelpers,
            $readiness,
            $canStop,
            $imageWaits,
        ): HomeAgent {
            $session = $sessions->get($agent->id);
            $runtime = $runtimes->get((string) $session?->id);

            return $this->optionOf(
                $agent,
                new AgentFacts(
                    $session,
                    $runtime,
                    $starts->get((string) $session?->id),
                    $requests->get((string) $runtime?->id),
                    $switches->get($agent->id),
                    $startOutcomes[$agent->id] ?? null,
                    in_array($session?->id, $waitingOnHelpers, true),
                    $readiness[(string) $session?->id] ?? null,
                    in_array($starts->get((string) $session?->id)?->id, $imageWaits, true),
                ),
                $conversations->get($agent->id, new Collection()),
                $refusals[$agent->id] ?? null,
                $canStop,
                $now,
            );
        })->all());
    }

    public function mainAgentId(): Option
    {
        return MainAgentDesignation::resolveDesignatedAgentId();
    }

    public function projectIdOf(string $agentId): string
    {
        return Agent::resolveProjectIdOf($agentId);
    }

    /**
     * The latest start outcome of each agent, by agent, unless the viewer dismissed that version of it; an older
     * outcome never stands in for a dismissed newer one.
     *
     * @param  list<string>  $ids
     * @return array<string, SessionStartOutcome>
     */
    private function startOutcomesOf(array $ids): array
    {
        $startOutcomes = SessionRequest::findLatestOf($ids)->map(fn (SessionRequest $record) => new SessionStartOutcome(
            $record->agent_id,
            $record->request_id,
            $record->disposition,
            $record->session_id,
            $record->refusal_reason,
        ));

        $dismissed = SessionOutcomeDismissal::resolveDismissedKeysOf(
            $this->actors->actor(),
            array_values($startOutcomes->map(fn (SessionStartOutcome $start) => $start->requestId)->all()),
        );

        return $startOutcomes->reject(
            fn (SessionStartOutcome $start) => in_array($start->key(), $dismissed, true),
        )->all();
    }

    /**
     * @param  Collection<int, DriverConversation>  $conversations
     */
    private function optionOf(
        Agent $agent,
        AgentFacts $facts,
        Collection $conversations,
        string|null $startRefusal,
        bool $canStop,
        CarbonImmutable $now,
    ): HomeAgent {
        $session = $facts->session;
        $runtime = $facts->runtime;
        $switch = $facts->switch;

        $resumable = array_values($conversations->take(self::CONVERSATIONS_SHOWN)->map(
            fn (DriverConversation $conversation) => new ResumableConversation(
                $conversation->id,
                $conversation->resume_protocol,
                $conversation->created_at->toImmutable(),
            ),
        )->all());

        return new HomeAgent(
            $agent->id,
            $agent->name,
            $agent->profile_key,
            $agent->assigneeIdentity(),
            $agent->isRetired(),
            AgentPresence::of($agent->isRetired(), $session !== null, $switch?->stage, $startRefusal !== null),
            $session?->id,
            $runtime === null ? 0 : $runtime->process_generation,
            $runtime?->hasScreen() === true,
            $switch?->id,
            $switch?->stage,
            AgentAction::offeredFor(
                $agent->isRetired(),
                $session !== null,
                $runtime?->hasScreen() === true,
                $resumable !== [],
                $switch?->stage,
            ),
            $resumable,
            $startRefusal,
            $facts->startOutcome,
            AgentStatusDecision::of(
                $facts->evidence($agent->isRetired(), $canStop, $now),
                $this->remedyWords,
            ),
            $session?->driver_key,
            $session?->driver_label,
            $session?->model,
            $runtime === null ? HoldReason::None : $runtime->hold_reason,
            sessionEffort: $session?->effort,
        );
    }
}
