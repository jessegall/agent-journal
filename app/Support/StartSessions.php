<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Sessions\StartTransaction;
use App\Events\Sessions\SessionClosed;
use App\Events\Sessions\SessionOpened;
use App\Events\Sessions\StartSettingsRequested;
use App\Exceptions\StartRefused;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Support\Drivers\Contracts\DriverAdapters;
use App\Values\RuntimeIntent;
use App\Values\SelectedDriver;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Starts an agent: one journal session and one credential per start, its isolated settings, and the start event
 * that opens its stack, all in one start transaction. A clear or resume inside the start keeps the journal session.
 */
final readonly class StartSessions
{
    public function __construct(
        private StartTransaction $transaction,
        private AgentSessions $sessions,
        private StartTokens $credentials,
        private AgentRuntimes $runtimes,
        private Dispatcher $events,
        private CommandFacts $facts,
        private DriverAdapters $adapters,
    ) {}

    /**
     * Starts a session with its credential, and, with a runtime intent, its runtime in Starting and the first delivery,
     * all in one start transaction.
     */
    public function start(
        Agent $agent,
        SelectedDriver $selection,
        string $requestId,
        AgentSession|null $parent = null,
        RuntimeIntent|null $intent = null,
        RecordIdentity|null $authorizedSource = null,
    ): StartedAgent {
        $settings = $this->settingsFor($selection);

        return $this->transaction->run(
            fn () => $this->open($agent, $selection, $requestId, $parent, $settings, $intent, $authorizedSource),
        );
    }

    /**
     * The same start inside a transaction its caller already holds, such as the StartAgent command's; it opens none.
     *
     * @throws StartRefused
     */
    public function startInTransaction(
        Agent $agent,
        SelectedDriver $selection,
        string $requestId,
        AgentSession|null $parent = null,
        RecordIdentity|null $authorizedSource = null,
        RuntimeIntent|null $intent = null,
    ): StartedAgent {
        return $this->open(
            $agent,
            $selection,
            $requestId,
            $parent,
            $this->settingsFor($selection),
            $intent,
            $authorizedSource,
        );
    }

    /**
     * @throws StartRefused
     */
    private function settingsFor(SelectedDriver $selection): IsolatedHookSettings
    {
        $driver = $selection->driver;
        $settings = new IsolatedHookSettings();
        $this->events->dispatch(new StartSettingsRequested($driver, $settings));

        if (! $settings->hasHooks()) {
            throw StartRefused::withoutHooks($driver);
        }

        return $settings;
    }

    /**
     * @throws StartRefused
     */
    private function open(
        Agent $agent,
        SelectedDriver $selection,
        string $requestId,
        AgentSession|null $parent,
        IsolatedHookSettings $settings,
        RuntimeIntent|null $intent,
        RecordIdentity|null $authorizedSource,
    ): StartedAgent {
        $session = $this->sessions->start($agent, $selection, $requestId, $parent);
        $token = $this->credentials->issue($session);
        [$runtime, $firstRequest] = $intent === null ? [
            null,
            null,
        ] : $this->runtimes->open($session, $intent, $token);

        if ($runtime !== null) {
            $session->keepDriverLabel($runtime->driver_label);
        }

        $this->facts->publishAfterCommit(new SessionOpened($agent->id, $session->id, $authorizedSource));
        $this->facts->runTransactionListeners();

        return new StartedAgent(
            $session,
            $token,
            $settings->content(),
            $this->adapters->for($selection->driver)->modelArguments($selection->model),
            $runtime,
            $firstRequest,
        );
    }

    public function end(AgentSession $session): void
    {
        $this->transaction->runForSession($session->id, function () use ($session): void {
            $this->sessions->end($session);
            $this->credentials->revoke($session);

            $this->facts->publishAfterCommit(new SessionClosed($session->agent_id, $session->id));
            $this->facts->runTransactionListeners();
        });
    }
}
