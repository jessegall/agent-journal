<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Agents\Contracts\RuntimeResolver;
use App\Agents\Data\RuntimeStatus;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Operations\Enums\AccessType;
use App\Reads\Support\ReadBuilder;
use Carbon\CarbonImmutable;

final readonly class RuntimeRecords implements RuntimeResolver
{
    public function __construct(private CurrentActor $actors, private CurrentAuthorizer $authorizer) {}

    public function page(int $page, int $perPage): array
    {
        $now = CarbonImmutable::now();

        return array_values($this->visibleRuntimes()
            ->with('session')
            ->withWatchers()
            ->orderBy('id')
            ->forPage(max(1, $page), $perPage)
            ->readLimit($perPage)
            ->get()
            ->map(fn (AgentRuntime $runtime) => $runtime->status($now))
            ->all());
    }

    public function forSession(string $sessionId): RuntimeStatus
    {
        return $this->visibleRuntimeOf($sessionId)->status(CarbonImmutable::now());
    }

    public function folderOf(string $sessionId): string
    {
        return $this->visibleRuntimeOf($sessionId)->canonical_folder;
    }

    public function requestsOf(string $sessionId, int $limit): array
    {
        return array_values(DriverRequest::query()
            ->where('agent_runtime_id', $this->visibleRuntimeOf($sessionId)->id)
            ->orderByDesc('sequence')
            ->readLimit($limit)
            ->get()
            ->map(fn (DriverRequest $request) => $request->status())
            ->all());
    }

    private function visibleRuntimeOf(string $sessionId): AgentRuntime
    {
        return $this->visibleRuntimes()->with('session')->where('agent_session_id', $sessionId)->readLimit(1)->firstOr(
            fn () => throw StackTargetRefused::forTarget("session {$sessionId}"),
        );
    }

    /**
     * A caller that inspects agents sees every runtime; any other sees only the runtimes of its own sessions, as
     * SessionRecords decides.
     *
     * @return ReadBuilder<AgentRuntime>
     */
    private function visibleRuntimes(): ReadBuilder
    {
        $actor = $this->actors->actor();
        $query = AgentRuntime::query();

        return $this->inspectsAgents() ? $query : $query->whereRelation('session', 'agent_id', $actor->id);
    }

    /**
     * Whether the caller may see every agent's sessions and runtimes, not only its own.
     */
    private function inspectsAgents(): bool
    {
        return $this->authorizer->filterActions(AgentMaintenancePolicy::class, Agent::class, [AccessType::Read]) !== [];
    }
}
