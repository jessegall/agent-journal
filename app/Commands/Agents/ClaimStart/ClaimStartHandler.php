<?php

declare(strict_types=1);

namespace App\Commands\Agents\ClaimStart;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Drivers\UnstartableDriver;
use App\Enums\Agents\SessionProcessState;
use App\Events\Sessions\AccountSettingsRequested;
use App\Events\Sessions\ChildCheckoutRequested;
use App\Exceptions\StartClaimRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Support\AccountStartSettings;
use App\Support\ChildCheckoutSlot;
use App\Support\ClaimedStart;
use App\Support\HeartbeatService;
use App\Support\StartExtensionRequests;

/**
 * Hands the host a pending start of a runtime assigned to it, with the recipe the driver's adapter checked and, for a
 * connected project's child, the checkout its worktree is prepared for; another host's start is refused. When the
 * driver's build cannot start here, the start ends stopped with that reason, its session and runtime end, and the host
 * gets none; when the adapter names no sign-in method for the account, the claim rolls back and the start stays
 * pending.
 */
final readonly class ClaimStartHandler implements CommandHandler
{
    public function __construct(private StartExtensionRequests $extensions, private HeartbeatService $heartbeats) {}

    /**
     * @throws StartClaimRefused
     */
    public function handle(ClaimStartCommand $command): ClaimedStart|null
    {
        $runtime = AgentRuntime::ofSession($command->sessionId)
            ?? throw StartClaimRefused::withoutRuntime($command->sessionId);

        if (! $runtime->isAssignedTo($command->hostId)) {
            throw StartClaimRefused::onAnotherHost($command->sessionId, $command->hostId);
        }

        $start = $this->claimFor($command->hostId, $command->sessionId);

        if ($start === null) {
            return null;
        }

        $session = AgentSession::query()->findOrFail($start->session_id);
        $driver = $session->selection->driver;
        $settings = new AccountStartSettings();
        $requested = new AccountSettingsRequested($driver, $start->accountIdentity, $start->directory, $settings);

        try {
            $this->extensions->accountSettings($requested);
        } catch (UnstartableDriver $refusal) {
            // The driver's build cannot start here at all: the start ends with the reason, and its session and
            // runtime end as a reported exit ends them, so the agent can start again.
            $start->refuse($refusal->getMessage());
            $this->heartbeats->markExited($session, $refusal->getMessage());

            return null;
        }

        $checkout = new ChildCheckoutSlot();

        if ($session->parent_session_id !== null) {
            $requested = new ChildCheckoutRequested(
                $command->hostId,
                $session->parent_session_id,
                $session->agent_id,
                $checkout,
            );

            $this->extensions->childCheckout($requested);
        }

        return new ClaimedStart(
            $start->start_key,
            $start->session_id,
            $start->directory,
            $start->account_generation,
            $settings->signInMethod($driver),
            $settings->recipeFor($driver, $start->transport_profile),
            SessionRequest::conversationTargetOf($start->session_id),
            SessionRequest::requiresConversation($start->session_id),
            $checkout->checkouts(),
        );
    }

    /**
     * The pending start of the session, taken by the host that will make its process; none when it was cancelled or
     * taken already. A start whose session ended is cancelled instead, so no process starts for it.
     */
    private function claimFor(string $hostId, string $sessionId): SessionProcess|null
    {
        $start = SessionProcess::supervised()
            ->where('session_id', $sessionId)
            ->where('state', SessionProcessState::Pending->value)
            ->lockForUpdate()
            ->first();

        if ($start === null) {
            return null;
        }

        if (! AgentSession::query()->findOrFail($sessionId)->isActive()) {
            $start->cancelPending();

            return null;
        }

        $start->claimOn($hostId);

        return $start;
    }
}
