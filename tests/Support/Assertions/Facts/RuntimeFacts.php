<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Hosts\ProcessFeed;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostProcess;
use Tests\Support\Assertions\Contracts\Facts;
use Tests\Support\Hosts\AccountOwners;

/**
 * An agent's runtime as a test asserts it: its host, the conversation its driver named, its first request, whether
 * its start is proven, the processes the journal opened for it by purpose and its account's live owner.
 */
final readonly class RuntimeFacts implements Facts
{
    public function __construct(private AgentRuntime $runtime, private ProcessFeed $feed) {}

    public function facts(): array
    {
        return [
            'host' => $this->runtime->host_id,
            'conversation' => $this->runtime->conversation_id,
            'firstRequest' => function () {
                $request = DriverRequest::query()
                    ->where('agent_runtime_id', $this->runtime->id)
                    ->orderBy('sequence')
                    ->first();

                return $request === null ? null : new RequestFacts($request);
            },
            'startProven' => fn () => $this->runtime->fresh()?->hasProvenStart() ?? false,
            'processes' => fn () => $this->processesByPurpose(),
            'accountOwner' => function () {
                $owner = AccountOwners::liveOwnerOf($this->runtime);

                return $owner === null ? null : new HostProcessFacts($owner->id, $this->feed);
            },
        ];
    }

    /**
     * @return array<string, list<HostProcessFacts>>
     */
    private function processesByPurpose(): array
    {
        $purposes = [];

        foreach (HostProcess::query()->where('agent_runtime_id', $this->runtime->id)->orderBy('id')->get() as $process) {
            $purposes[$process->purpose->value][] = new HostProcessFacts($process->id, $this->feed);
        }

        return $purposes;
    }
}
