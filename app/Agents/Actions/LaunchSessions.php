<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Events\LaunchEnded;
use App\Agents\Events\LaunchSettingsRequested;
use App\Agents\Events\LaunchStarted;
use App\Agents\Exceptions\LaunchRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\IsolatedHookSettings;
use App\Agents\Support\LaunchedAgent;
use App\Agents\Support\RuntimeIntent;
use App\Agents\Support\SelectedProgram;
use App\Contracts\LaunchTransaction;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Launches an agent: one journal session and one credential per launch, its isolated settings, and the launch event
 * that opens its stack, all in one launch transaction. A clear or resume inside the launch keeps the journal session.
 */
final readonly class LaunchSessions
{
    public function __construct(
        private LaunchTransaction $transaction,
        private AgentSessions $sessions,
        private LaunchCredentials $credentials,
        private AgentRuntimes $runtimes,
        private Dispatcher $events,
    ) {}

    /**
     * Starts a session with its credential, and, with a runtime intent, its runtime in Starting and the first delivery,
     * all in one launch transaction (doc 40, section 11).
     */
    public function launch(Agent $agent, SelectedProgram $selection, string $requestId, AgentSession|null $parent = null, RuntimeIntent|null $intent = null): LaunchedAgent
    {
        $settings = $this->settingsFor($selection);

        return $this->transaction->run(fn (): LaunchedAgent => $this->start($agent, $selection, $requestId, $parent, $settings, $intent));
    }

    /**
     * The same launch inside a transaction its caller already holds, such as the LaunchAgent command's; it opens none.
     *
     * @throws LaunchRefused
     */
    public function launchInTransaction(Agent $agent, SelectedProgram $selection, string $requestId, AgentSession|null $parent = null): LaunchedAgent
    {
        return $this->start($agent, $selection, $requestId, $parent, $this->settingsFor($selection), null);
    }

    /**
     * @throws LaunchRefused
     */
    private function settingsFor(SelectedProgram $selection): IsolatedHookSettings
    {
        $program = $selection->program->value;
        $settings = new IsolatedHookSettings();
        $this->events->dispatch(new LaunchSettingsRequested($program, $settings));

        if (! $settings->hasHooks()) {
            throw LaunchRefused::withoutHooks($program);
        }

        return $settings;
    }

    /**
     * @throws LaunchRefused
     */
    private function start(Agent $agent, SelectedProgram $selection, string $requestId, AgentSession|null $parent, IsolatedHookSettings $settings, RuntimeIntent|null $intent): LaunchedAgent
    {
        $session = $this->sessions->start($agent, $selection, $requestId, $parent);
        $token = $this->credentials->issue($session);
        [$runtime, $firstRequest] = $intent === null ? [null, null] : $this->runtimes->open($session, $intent, $token);

        $this->events->dispatch(new LaunchStarted($agent->id, $session->id, $agent->role));

        return new LaunchedAgent($session, $token, $settings->content(), $selection->program->modelArguments($selection->model), $runtime, $firstRequest);
    }

    public function end(AgentSession $session): void
    {
        $this->transaction->runForSession($session->id, function () use ($session): void {
            $this->sessions->end($session);
            $this->credentials->revoke($session);

            $this->events->dispatch(new LaunchEnded($session->agent_id, $session->id));
        });
    }
}
