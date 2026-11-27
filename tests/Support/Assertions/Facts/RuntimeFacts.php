<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use Tests\Support\Assertions\Contracts\Facts;

/**
 * An agent's runtime as a test asserts it: its host, the conversation its driver named and its first request.
 */
final readonly class RuntimeFacts implements Facts
{
    public function __construct(private AgentRuntime $runtime) {}

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
        ];
    }
}
