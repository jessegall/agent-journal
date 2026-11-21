<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\AgentDirectory;
use App\Agents\Enums\AgentAction;
use App\Agents\Enums\AgentPresence;
use App\Agents\Enums\DriverVariant;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverConversation;
use App\Agents\Models\DriverSwitch;
use App\Agents\Models\MainAgentDesignation;
use App\Agents\Support\AgentInspection;
use App\Agents\Support\AgentOption;
use App\Agents\Support\ResumableConversation;
use App\Drivers\Enums\HookDriver;
use Illuminate\Support\Collection;
use PhpOption\Option;

/**
 * Reads the agents for Home in a fixed number of queries: the agents, their running sessions and runtimes, their latest switches
 * and their latest conversations, each for every shown agent at once.
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

    public function __construct(private CurrentActor $actors, private AgentInspection $inspection) {}

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
        $switches = DriverSwitch::query()->whereIn('agent_id', $ids)->orderByDesc('created_at')
            ->limit(self::AGENTS_SHOWN * 2)->get()->unique('agent_id')->keyBy('agent_id');
        $conversations = DriverConversation::query()->whereIn('agent_id', $ids)->orderByDesc('created_at')
            ->readLimit(self::AGENTS_SHOWN * self::CONVERSATIONS_SHOWN)->get()->groupBy('agent_id');

        return array_values($agents->map(fn (Agent $agent) => self::optionOf(
            $agent,
            $sessions->get($agent->id),
            $runtimes->get((string) $sessions->get($agent->id)?->id),
            $switches->get($agent->id),
            $conversations->get($agent->id, new Collection()),
        ))->all());
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
     * @param  Collection<int, DriverConversation>  $conversations
     */
    private static function optionOf(
        Agent $agent,
        AgentSession|null $session,
        AgentRuntime|null $runtime,
        DriverSwitch|null $switch,
        Collection $conversations,
    ): AgentOption {
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
            AgentPresence::of($agent->isRetired(), $session !== null, $switch?->stage),
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
        );
    }
}
