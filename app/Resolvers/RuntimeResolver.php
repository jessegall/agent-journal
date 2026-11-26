<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Agents\AgentInspection;
use App\Exceptions\StackTargetRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Processes\Data\RuntimeStatus;
use App\Sessions\Contracts\RuntimeResolver as RuntimeResolverContract;
use App\Support\ReadBuilder;
use Carbon\CarbonImmutable;

final readonly class RuntimeResolver implements RuntimeResolverContract
{
    public function __construct(private CurrentActor $actors, private AgentInspection $inspection) {}

    public function page(int $page, int $perPage): array
    {
        $now = CarbonImmutable::now();

        return array_values($this->visibleRuntimes()
            ->with('session')
            ->withWatchers()
            ->orderBy('id')
            ->forPage(max(1, $page), $perPage)
            ->readExactly($perPage)
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
            ->ofAgentRuntime($this->visibleRuntimeOf($sessionId)->id)
            ->bySequenceDescending()
            ->readExactly($limit)
            ->get()
            ->map(fn (DriverRequest $request) => $request->status)
            ->all());
    }

    private function visibleRuntimeOf(string $sessionId): AgentRuntime
    {
        return $this->visibleRuntimes()->with('session')->where('agent_session_id', $sessionId)->limit(1)->firstOr(
            StackTargetRefused::throwing()->forTarget("session {$sessionId}"),
        );
    }

    /**
     * A caller that inspects agents sees every runtime; any other sees only the runtimes of its own sessions, as
     * SessionResolver decides.
     *
     * @return ReadBuilder<AgentRuntime>
     */
    private function visibleRuntimes(): ReadBuilder
    {
        $actor = $this->actors->actor();
        $query = AgentRuntime::query();

        if ($this->inspection->seesEveryAgent()) {
            return $query;
        }

        return $query->whereRelation('session', 'agent_id', $actor->id);
    }
}
