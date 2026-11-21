<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Events\SessionClosed;
use App\Agents\Events\SessionOpened;
use App\Agents\Events\StartSettingsRequested;
use App\Agents\Exceptions\StartRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\IsolatedHookSettings;
use App\Agents\Support\StartedAgent;
use App\Agents\Values\RuntimeIntent;
use App\Agents\Values\SelectedProgram;
use App\Contracts\StartTransaction;
use App\Records\Support\RecordIdentity;
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
    ) {}

    /**
     * Starts a session with its credential, and, with a runtime intent, its runtime in Starting and the first delivery,
     * all in one start transaction (doc 40, section 11).
     */
    public function start(
        Agent $agent,
        SelectedProgram $selection,
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
        SelectedProgram $selection,
        string $requestId,
        AgentSession|null $parent = null,
        RecordIdentity|null $authorizedSource = null,
    ): StartedAgent {
        return $this->open(
            $agent,
            $selection,
            $requestId,
            $parent,
            $this->settingsFor($selection),
            null,
            $authorizedSource,
        );
    }

    /**
     * @throws StartRefused
     */
    private function settingsFor(SelectedProgram $selection): IsolatedHookSettings
    {
        $program = $selection->program->value;
        $settings = new IsolatedHookSettings();
        $this->events->dispatch(new StartSettingsRequested($program, $settings));

        if (! $settings->hasHooks()) {
            throw StartRefused::withoutHooks($program);
        }

        return $settings;
    }

    /**
     * @throws StartRefused
     */
    private function open(
        Agent $agent,
        SelectedProgram $selection,
        string $requestId,
        AgentSession|null $parent,
        IsolatedHookSettings $settings,
        RuntimeIntent|null $intent,
        RecordIdentity|null $authorizedSource,
    ): StartedAgent {
        $session = $this->sessions->start($agent, $selection, $requestId, $parent);
        $token = $this->credentials->issue($session);
        [$runtime, $firstRequest] = $intent === null ? [null, null] : $this->runtimes->open($session, $intent, $token);

        $this->events->dispatch(new SessionOpened($agent->id, $session->id, $authorizedSource));

        return new StartedAgent(
            $session,
            $token,
            $settings->content(),
            $selection->program->modelArguments($selection->model),
            $runtime,
            $firstRequest,
        );
    }

    public function end(AgentSession $session): void
    {
        $this->transaction->runForSession($session->id, function () use ($session): void {
            $this->sessions->end($session);
            $this->credentials->revoke($session);

            $this->events->dispatch(new SessionClosed($session->agent_id, $session->id));
        });
    }
}
