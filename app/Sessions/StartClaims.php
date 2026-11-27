<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Accounts\AccountStartRecipe;
use App\Accounts\AccountStartSettings;
use App\Agents\Drivers\Contracts\UnstartableDriver;
use App\Events\Sessions\AccountSettingsRequested;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Sessions\Exceptions\StartClaimRefused;

/**
 * Takes a pending start for the host it is assigned to, with the recipe the driver's adapter checked; another host's
 * start is refused. A build that cannot start here ends the start stopped, and a missing sign-in method rolls the claim
 * back. Hosts and the journal itself claim this way.
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
            $settings = $this->settingsOf($start, $session, $start->directory);
        } catch (UnstartableDriver $refusal) {
            // The driver's build cannot start here at all: the start ends with the reason, and its session and
            // runtime end as a reported exit ends them, so the agent can start again.
            $this->heartbeats->refuseStart($start, $refusal->getMessage());

            return null;
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

        return $this->settingsOf($start, $session, $start->directory)
            ->recipeFor($session->selection->driver, $start->transport_profile);
    }

    /**
     * The start's recipe for its container, where the account folder is mounted at the given folder.
     *
     * @throws UnstartableDriver
     */
    public function containedRecipeOf(SessionProcess $start, string $accountFolder): AccountStartRecipe
    {
        $session = AgentSession::query()->findOrFail($start->session_id);

        return $this->settingsOf($start, $session, $accountFolder)
            ->recipeFor($session->selection->driver, $start->transport_profile);
    }

    /**
     * @throws UnstartableDriver
     */
    private function settingsOf(SessionProcess $start, AgentSession $session, string $directory): AccountStartSettings
    {
        $driver = $session->selection->driver;
        $settings = new AccountStartSettings();
        $requested = new AccountSettingsRequested($driver, $start->account_identity, $directory, $settings);
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
