<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Drivers\UnstartableDriver;
use App\Events\Sessions\AccountSettingsRequested;
use App\Events\Sessions\ChildCheckoutRequested;
use App\Exceptions\StartClaimRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;

/**
 * Takes a pending start of a runtime for the host it is assigned to, with the recipe the driver's adapter checked and,
 * for a connected project's child, the checkout its worktree is prepared for; another host's start is refused. When
 * the driver's build cannot start here, the start ends stopped with that reason, its session and runtime end, and
 * nothing is taken; when the adapter names no sign-in method for the account, the claim rolls back and the start stays
 * pending. A host claims it this way, and so does the journal for a runtime it opens itself.
 */
final readonly class StartClaims
{
    public function __construct(private StartExtensionRequests $extensions, private StartHeartbeats $heartbeats) {}

    /**
     * @throws StartClaimRefused
     */
    public function claim(string $hostId, string $sessionId): ClaimedStart|null
    {
        $runtime = AgentRuntime::findForSession($sessionId)
            ?? throw StartClaimRefused::withoutRuntime($sessionId);

        if (! $runtime->isAssignedTo($hostId)) {
            throw StartClaimRefused::onAnotherHost($sessionId, $hostId);
        }

        $start = $this->claimFor($hostId, $sessionId);

        if ($start === null) {
            return null;
        }

        $session = AgentSession::query()->findOrFail($start->session_id);
        $driver = $session->selection->driver;

        try {
            $settings = $this->settingsOf($start, $session);
        } catch (UnstartableDriver $refusal) {
            // The driver's build cannot start here at all: the start ends with the reason, and its session and
            // runtime end as a reported exit ends them, so the agent can start again.
            $this->heartbeats->refuseStart($start, $refusal->getMessage());

            return null;
        }

        $checkout = new ChildCheckoutSlot();

        if ($session->parent_session_id !== null) {
            $requested = new ChildCheckoutRequested(
                $hostId,
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
            SessionRequest::resolveConversationTargetOf($start->session_id),
            SessionRequest::isConversationRequired($start->session_id),
            $checkout->checkouts(),
        );
    }

    /**
     * The recipe a taken start's driver runs with, built again for each process of the start, so no secret of it is
     * kept between them.
     *
     * @throws UnstartableDriver
     */
    public function recipeOf(SessionProcess $start): AccountStartRecipe
    {
        $session = AgentSession::query()->findOrFail($start->session_id);

        return $this->settingsOf($start, $session)->recipeFor($session->selection->driver, $start->transport_profile);
    }

    /**
     * @throws UnstartableDriver
     */
    private function settingsOf(SessionProcess $start, AgentSession $session): AccountStartSettings
    {
        $driver = $session->selection->driver;
        $settings = new AccountStartSettings();
        $requested = new AccountSettingsRequested($driver, $start->accountIdentity, $start->directory, $settings);
        $this->extensions->accountSettings($requested);

        return $settings;
    }

    /**
     * The pending start of the session, taken by the host that will make its process; none when it was cancelled or
     * taken already. A start whose session ended is cancelled instead, so no process starts for it.
     */
    private function claimFor(string $hostId, string $sessionId): SessionProcess|null
    {
        $start = SessionProcess::query()->supervised()
            ->ofSessions([$sessionId])
            ->pending()
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
