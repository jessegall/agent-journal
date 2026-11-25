<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Sessions\AgentDirectory;
use App\Contracts\Time\ServerClock;
use App\Enums\Agents\AccessType;
use App\Enums\Agents\AgentAction;
use App\Enums\Agents\AgentPresence;
use App\Enums\Drivers\HoldReason;
use App\Exceptions\StackTargetRefused;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Agents\MainAgentDesignation;
use App\Models\Drivers\DriverConversation;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\DriverSwitch;
use App\Models\Sessions\SessionOutcomeDismissal;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Policies\AgentPolicy;
use App\Support\ActorIdentity;
use App\Support\AgentFacts;
use App\Support\AgentInspection;
use App\Support\AgentOption;
use App\Support\AgentStatusRules;
use App\Support\ResumableConversation;
use App\Support\SessionStartOutcome;
use App\Support\StartRemedyWords;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use PhpOption\Option;

/**
 * Reads the agents for Home in a fixed number of queries: the agents, their running sessions and runtimes, the
 * refusals of their starts, their latest start outcomes the viewer has not dismissed, their latest switches and their
 * latest conversations, each for every shown agent at once.
 */
final readonly class AgentRecords implements AgentDirectory
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
        $query = Agent::query()->byCreatedAt();

        $agents = ($this->inspection->seesEveryAgent() ? $query : $query->whereKey($this->actors->actor()->id))
            ->limit(self::AGENTS_SHOWN)
            ->get();

        $ids = $agents->modelKeys();

        $sessions = AgentSession::query()->ofAgents($ids)->running()
            ->limit(self::AGENTS_SHOWN)->get()->keyBy('agent_id');

        $runtimes = AgentRuntime::query()->ofSessions($sessions->pluck('id')->all())
            ->limit(self::AGENTS_SHOWN)->get()->keyBy('agent_session_id');

        $starts = SessionProcess::supervised()->whereIn('session_id', $sessions->pluck('id')->all())
            ->orderByDesc('created_at')->limit(self::AGENTS_SHOWN * 2)->get()->unique('session_id')
            ->keyBy('session_id');

        $requests = DriverRequest::query()->ofAgentRuntimes($runtimes->pluck('id')->all())
            ->bySequenceDescending()->limit(self::AGENTS_SHOWN * 2)->get()->unique('agent_runtime_id')
            ->keyBy('agent_runtime_id');

        $waitingOnHelpers = AgentRuntime::sessionsWaitingOnHelpers(array_values(array_map(
            strval(...),
            $sessions->pluck('id')->all(),
        )));

        $readiness = SessionRequest::latestReadinessOf(array_values(array_map(
            strval(...),
            $sessions->pluck('id')->all(),
        )));

        $canStop = $this->authorizer->filterActions(AgentPolicy::class, Agent::class, [AccessType::Edit]) !== [];

        $switches = DriverSwitch::query()->ofAgents($ids)->newestCreatedFirst()
            ->limit(self::AGENTS_SHOWN * 2)->get()->unique('agent_id')->keyBy('agent_id');

        $refusals = SessionProcess::refusalsOf(array_values(array_map(strval(...), $ids)));

        $startOutcomes = $this->startOutcomesOf(array_values(array_map(strval(...), $ids)));

        $conversations = DriverConversation::query()->ofAgents($ids)->newestCreatedFirst()
            ->readLimit(self::AGENTS_SHOWN * self::CONVERSATIONS_SHOWN)->get()->groupBy('agent_id');

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
        ): AgentOption {
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
                ),
                $conversations->get($agent->id, new Collection()),
                $refusals[$agent->id] ?? null,
                $canStop,
                $now,
            );
        })->all());
    }

    public function visibleAgent(string $agentId): AgentOption
    {
        foreach ($this->visible() as $agent) {
            if ($agent->agentId === $agentId) {
                return $agent;
            }
        }

        throw StackTargetRefused::forTarget("agent {$agentId}");
    }

    public function mainAgentId(): Option
    {
        return MainAgentDesignation::designatedAgentId();
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
        $startOutcomes = SessionRequest::latestOf($ids)->map(fn (SessionRequest $record) => new SessionStartOutcome(
            $record->agent_id,
            $record->request_id,
            $record->disposition,
            $record->session_id,
            $record->refusal_reason,
        ));

        $dismissed = SessionOutcomeDismissal::dismissedKeysOf(
            ActorIdentity::of($this->actors->actor()),
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
    ): AgentOption {
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

        return new AgentOption(
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
            AgentStatusRules::of(
                $facts->evidence($agent->isRetired(), $resumable !== [], $canStop, $now),
                $this->remedyWords,
            ),
            $session?->driver_key,
            $session?->driver_label,
            $session?->model,
            $runtime === null ? HoldReason::None : $runtime->hold_reason,
        );
    }
}
