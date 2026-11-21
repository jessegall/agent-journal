<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\DriverOperation;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\NavigationRequest;
use App\Agents\Values\DriverRequestPayload;
use App\Agents\Values\NavigationRound;
use App\Agents\Values\StackTarget;

/**
 * Appends the main agent's rounds to the stalled runtime's own ledger as Navigate driver requests, named by the
 * navigation request and the row version they answer, so a repeated round is the same request.
 */
final readonly class NavigationRounds
{
    public function __construct(private DriverRequests $requests) {}

    /**
     * The idempotency key of the round that answers the request at the row version.
     */
    public static function keyOf(NavigationRequest $navigation, int $rowVersion): string
    {
        return "navigation:{$navigation->id}:{$rowVersion}";
    }

    public function append(NavigationRequest $navigation, NavigationRound $round): DriverRequest
    {
        $runtime = AgentRuntime::query()->with('session')->findOrFail($navigation->agent_runtime_id);
        $target = new StackTarget($runtime->session->agent_id, $runtime->agent_session_id);

        return $this->requests->append(
            $target,
            DriverOperation::Navigate,
            self::keyOf($navigation, $round->rowVersion),
            DriverRequestPayload::navigate($round),
        );
    }
}
