<?php

declare(strict_types=1);

namespace App\Agents\Readers;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Contracts\RuntimeReader;
use App\Agents\Data\DriverRequestStatus;
use App\Agents\Data\RuntimeStatus;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Reads\Support\ReadBuilder;
use Carbon\CarbonImmutable;

final readonly class RuntimeRecords implements RuntimeReader
{
    public function __construct(private CurrentActor $actors) {}

    public function page(int $page, int $perPage): array
    {
        $now = CarbonImmutable::now();

        return array_values($this->visibleRuntimes()
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
        return $this->visibleRuntimes()->where('agent_session_id', $sessionId)->readLimit(1)->first()
            ?? throw StackTargetRefused::forTarget("session {$sessionId}");
    }

    /**
     * A user sees every runtime; an agent sees only the runtimes of its own sessions, as SessionRecords decides.
     *
     * @return ReadBuilder<AgentRuntime>
     */
    private function visibleRuntimes(): ReadBuilder
    {
        $actor = $this->actors->actor();
        $query = AgentRuntime::query();

        return $actor->isUser() ? $query : $query->whereRelation('session', 'agent_id', $actor->id);
    }
}
