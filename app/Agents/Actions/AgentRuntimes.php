<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Enums\DriverOperation;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverRequest;
use App\Agents\Support\RuntimeIntent;
use Illuminate\Support\Str;

/**
 * Opens a session's runtime in Starting and, when the intent carries content, its first delivery; called inside the
 * launch transaction, it opens none of its own.
 */
final readonly class AgentRuntimes
{
    /**
     * @return array{0: AgentRuntime, 1: DriverRequest|null}
     */
    public function open(AgentSession $session, RuntimeIntent $intent, string $launchToken): array
    {
        $runtime = AgentRuntime::query()->make([
            'agent_session_id' => $session->id,
            'host_id' => $intent->hostId,
            'driver_type' => $intent->driverType,
            'program' => $intent->program,
            'program_build' => $intent->programBuild,
            'profile' => $intent->profile,
            'canonical_folder' => $intent->folder,
        ]);
        $runtime->requested_model = $intent->model;
        $runtime->requested_effort = $intent->effort;
        $runtime->begin();
        $runtime->holdLaunchGrant($launchToken);

        if ($intent->firstMessage === null) {
            return [$runtime, null];
        }

        $request = DriverRequest::query()->make([
            'agent_runtime_id' => $runtime->id,
            'sequence' => 1,
            'operation' => DriverOperation::Deliver,
            'idempotency_key' => (string) Str::ulid(),
            'payload_digest' => hash('sha256', $intent->firstMessage),
            'message' => $intent->firstMessage,
            'expected_timing' => $runtime->activity->expectedTiming(),
            'expected_observed_at' => null,
        ]);
        $request->accept();

        return [$runtime, $request];
    }
}
