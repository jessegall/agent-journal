<?php

declare(strict_types=1);

namespace App\Navigation;

use App\Agents\DriverRequestLedger;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\NavigationRequest;
use App\Values\DriverRequestPayload;
use App\Values\NavigationRound;
use App\Values\StackTarget;

/**
 * Appends the main agent's rounds to the stalled runtime's own ledger as Navigate driver requests, named by the
 * navigation request and the row version they answer, so a repeated round is the same request.
 */
final readonly class NavigationRounds
{
    public function __construct(private DriverRequestLedger $requests) {}

    /**
     * The idempotency key of the round that answers the request at the row version.
     */
    public static function keyOf(NavigationRequest $navigation, int $rowVersion): string
    {
        return "navigation:{$navigation->id}:{$rowVersion}";
    }

    public function append(NavigationRequest $navigation, NavigationRound $round): DriverRequest
    {
        $runtime = AgentRuntime::query()->withSession()->findOrFail($navigation->agent_runtime_id);
        $target = new StackTarget($runtime->session->agent_id, $runtime->agent_session_id);

        return $this->requests->append(
            $target,
            DriverOperation::Navigate,
            self::keyOf($navigation, $round->rowVersion),
            DriverRequestPayload::navigate($round),
        );
    }
}
