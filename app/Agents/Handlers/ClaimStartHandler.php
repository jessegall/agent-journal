<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Actions\StartHeartbeats;
use App\Agents\Commands\ClaimStart;
use App\Agents\Contracts\UnstartableDriver;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Events\AccountSettingsRequested;
use App\Agents\Events\ChildCheckoutRequested;
use App\Agents\Exceptions\StartClaimRefused;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ProcessStart;
use App\Agents\Models\StartRecord;
use App\Agents\Support\AccountStartSettings;
use App\Agents\Support\ChildCheckoutSlot;
use App\Agents\Support\ClaimedStart;
use App\Agents\Support\StartExtensionRequests;
use App\Contracts\CommandHandler;

/**
 * Hands the host a pending start of a runtime assigned to it, with the recipe the driver's adapter checked and, for a
 * connected project's child, the checkout its worktree is prepared for; another host's start is refused. When the
 * driver's build cannot start here, the start ends stopped with that reason, its session and runtime end, and the host
 * gets none; when the adapter names no sign-in method for the account, the claim rolls back and the start stays
 * pending.
 */
final readonly class ClaimStartHandler implements CommandHandler
{
    public function __construct(private StartExtensionRequests $extensions, private StartHeartbeats $heartbeats) {}

    /**
     * @throws StartClaimRefused
     */
    public function handle(ClaimStart $command): ClaimedStart|null
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
        $driver = $session->selection()->driver->value;
        $settings = new AccountStartSettings();
        $requested = new AccountSettingsRequested($driver, $start->accountIdentity(), $start->directory, $settings);

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
            StartRecord::conversationTargetOf($start->session_id),
            StartRecord::requiresConversation($start->session_id),
            $checkout->checkouts(),
        );
    }

    /**
     * The pending start of the session, taken by the host that will make its process; none when it was cancelled or
     * taken already. A start whose session ended is cancelled instead, so no process starts for it.
     */
    private function claimFor(string $hostId, string $sessionId): ProcessStart|null
    {
        $start = ProcessStart::supervised()
            ->where('session_id', $sessionId)
            ->where('state', ProcessStartState::Pending->value)
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
