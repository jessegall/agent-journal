<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\ServerClock;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\AgentDirectory;
use App\Agents\Enums\AgentAction;
use App\Agents\Enums\AgentPresence;
use App\Agents\Enums\DriverVariant;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverConversation;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\DriverSwitch;
use App\Agents\Models\LaunchOutcomeDismissal;
use App\Agents\Models\MainAgentDesignation;
use App\Agents\Models\ProcessStart;
use App\Agents\Models\StartRecord;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\AgentFacts;
use App\Agents\Support\AgentInspection;
use App\Agents\Support\AgentOption;
use App\Agents\Support\AgentStatus;
use App\Agents\Support\LaunchOutcome;
use App\Agents\Support\ResumableConversation;
use App\Agents\Support\StartRemedyWords;
use App\Drivers\Enums\HookDriver;
use App\Operations\Enums\AccessType;
use Illuminate\Support\Collection;
use PhpOption\Option;

/**
 * Reads the agents for Home in a fixed number of queries: the agents, their running sessions and runtimes, the
 * refusals of their starts, their latest launch outcomes the viewer has not dismissed, their latest switches and their
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
        $query = Agent::query()->orderBy('created_at')->orderBy('id');

        $agents = ($this->inspection->seesEveryAgent() ? $query : $query->whereKey($this->actors->actor()->id))
            ->limit(self::AGENTS_SHOWN)
            ->get();

        $ids = $agents->modelKeys();

        $sessions = AgentSession::query()->whereIn('agent_id', $ids)->running()
            ->limit(self::AGENTS_SHOWN)->get()->keyBy('agent_id');

        $runtimes = AgentRuntime::query()->whereIn('agent_session_id', $sessions->pluck('id')->all())
            ->limit(self::AGENTS_SHOWN)->get()->keyBy('agent_session_id');

        $starts = ProcessStart::supervised()->whereIn('session_id', $sessions->pluck('id')->all())
            ->orderByDesc('created_at')->limit(self::AGENTS_SHOWN * 2)->get()->unique('session_id')
            ->keyBy('session_id');

        $requests = DriverRequest::query()->whereIn('agent_runtime_id', $runtimes->pluck('id')->all())
            ->orderByDesc('sequence')->limit(self::AGENTS_SHOWN * 2)->get()->unique('agent_runtime_id')
            ->keyBy('agent_runtime_id');

        $waitingOnHelpers = AgentRuntime::sessionsWaitingOnHelpers(array_values(array_map(
            strval(...),
            $sessions->pluck('id')->all(),
        )));

        $canStop = $this->authorizer->filterActions(AgentPolicy::class, Agent::class, [AccessType::Edit]) !== [];

        $switches = DriverSwitch::query()->whereIn('agent_id', $ids)->orderByDesc('created_at')
            ->limit(self::AGENTS_SHOWN * 2)->get()->unique('agent_id')->keyBy('agent_id');

        $refusals = ProcessStart::refusalsOf(array_values(array_map(strval(...), $ids)));

        $launches = $this->launchOutcomesOf(array_values(array_map(strval(...), $ids)));

        $conversations = DriverConversation::query()->whereIn('agent_id', $ids)->orderByDesc('created_at')
            ->readLimit(self::AGENTS_SHOWN * self::CONVERSATIONS_SHOWN)->get()->groupBy('agent_id');

        return array_values($agents->map(function (Agent $agent) use (
            $sessions,
            $runtimes,
            $starts,
            $requests,
            $switches,
            $conversations,
            $refusals,
            $launches,
            $waitingOnHelpers,
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
                    $launches[$agent->id] ?? null,
                    in_array($session?->id, $waitingOnHelpers, true),
                ),
                $conversations->get($agent->id, new Collection()),
                $refusals[$agent->id] ?? null,
                $canStop,
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
     * The latest launch outcome of each agent, by agent, unless the viewer dismissed that version of it; an older
     * outcome never stands in for a dismissed newer one.
     *
     * @param  list<string>  $agentIds
     * @return array<string, LaunchOutcome>
     */
    private function launchOutcomesOf(array $agentIds): array
    {
        $launches = StartRecord::latestOf($agentIds)->map(fn (StartRecord $record) => LaunchOutcome::of($record));
        $dismissed = LaunchOutcomeDismissal::dismissedKeysOf(
            ActorIdentity::of($this->actors->actor()),
            array_values($launches->map(fn (LaunchOutcome $launch) => $launch->requestId)->all()),
        );

        return $launches->reject(fn (LaunchOutcome $launch) => in_array($launch->key(), $dismissed, true))->all();
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
    ): AgentOption {
        $session = $facts->session;
        $runtime = $facts->runtime;
        $switch = $facts->switch;
        $resumable = array_values($conversations->take(self::CONVERSATIONS_SHOWN)->map(
            fn (DriverConversation $conversation) => new ResumableConversation(
                $conversation->id,
                HookDriver::from($conversation->driver),
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
            $runtime?->variant === DriverVariant::Terminal,
            $switch?->id,
            $switch?->stage,
            AgentAction::offeredFor(
                $agent->isRetired(),
                $session !== null,
                $runtime?->variant === DriverVariant::Terminal,
                $resumable !== [],
                $switch?->stage,
            ),
            $resumable,
            $startRefusal,
            $facts->launch,
            AgentStatus::of(
                $facts->evidence($agent->isRetired(), $resumable !== [], $canStop, $this->clock->now()),
                $this->remedyWords,
            ),
            $session?->driver,
        );
    }
}
