<?php

declare(strict_types=1);

namespace App\Recordings\Scenarios;

use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\HookCall;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Models\Projects\ProjectBinding;
use App\Recordings\Scenarios\Exceptions\ScenarioInvalid;
use Carbon\CarbonImmutable;

/**
 * One play of a scenario: the owner it runs as, the agents it plays with by their names in it, the sign-in attempt
 * and the code the user typed, which a submit-code step answers, and how many steps have run, which keys each step.
 */
final class ScenarioRun
{
    /**
     * The name a step gives the agent image, whichever build it is pinned to.
     */
    private const string AGENT_IMAGE = 'agent';

    /**
     * The name a step gives the ready images of the scenario's own driver.
     */
    private const string DRIVER_IMAGES = 'driver';

    /**
     * The folder each driver's image is built from, by the driver's name.
     */
    private const string DRIVER_FOLDERS = '.docker/drivers';

    private string|null $signInAttempt = null;

    private string|null $signInCode = null;

    private int $stepsRun = 0;

    private int $turnsAsked = 0;

    private string|null $lastAgent = null;

    private string|null $startRequest = null;

    private int|null $installerExit = null;

    /**
     * @param  array<string, string>  $agents  each agent's id, by its name in the scenario
     */
    public function __construct(
        public readonly Scenario $scenario,
        public readonly User $owner,
        private array $agents,
        public readonly string $agentImage,
        public readonly CarbonImmutable $startedAt = new CarbonImmutable(),
    ) {}

    /**
     * The image a step names: the agent image, whichever build it is pinned to, for the name agent; else as named.
     */
    public function imageNamed(string $name): string
    {
        if ($name === self::AGENT_IMAGE) {
            return $this->agentImage;
        }

        return $name;
    }

    /**
     * The images a step's name stands for: driver is every ready image the host holds of the scenario's own driver,
     * so a scenario that removes them makes the journal build its driver image again; any other name is one image.
     *
     * @return list<string>
     */
    public function imagesNamed(string $name): array
    {
        if ($name !== self::DRIVER_IMAGES) {
            return [$this->imageNamed($name)];
        }

        return HostDriverImage::resolveReadyImagesOf($this->hostId(), self::DRIVER_FOLDERS.'/'.$this->scenario->driver());
    }

    /**
     * @throws ScenarioInvalid
     */
    public function agentNamed(string $name): Agent
    {
        $id = $this->agents[$name] ?? throw ScenarioInvalid::at(
            $this->scenario->name,
            $this->stepsRun,
            "names the agent {$name}, which the run has not",
        );

        $this->lastAgent = $name;

        return Agent::query()->findOrFail($id);
    }

    /**
     * Each agent of the play that still runs a session, so a play that failed stops them and the next play finds
     * them free.
     *
     * @return list<Agent>
     */
    public function runningAgents(): array
    {
        return array_values(array_filter(
            array_map(fn (string $id) => Agent::query()->findOrFail($id), array_values($this->agents)),
            fn (Agent $agent) => AgentSession::query()->find($agent->current_session_id)?->hasEnded() === false,
        ));
    }

    /**
     * The agent the steps named last, whose session the facts are about.
     *
     * @throws ScenarioInvalid
     */
    public function lastAgent(): Agent
    {
        $missing = 'waits for an agent\'s fact before any step named an agent';

        $name = $this->lastAgent ?? throw ScenarioInvalid::at($this->scenario->name, $this->stepsRun, $missing);

        return $this->agentNamed($name);
    }

    /**
     * The host the scenario's host instructions go to: this journal's first serving enrolled host.
     *
     * @throws ScenarioInvalid
     */
    public function hostId(): string
    {
        $hosts = Host::findServingEnrolled();

        if ($hosts === []) {
            throw ScenarioInvalid::at($this->scenario->name, $this->stepsRun, 'instructions a host, and none is enrolled');
        }

        return $hosts[0]->id;
    }

    /**
     * The project binding on the host a project read reads through.
     *
     * @throws ScenarioInvalid
     */
    public function bindingIdOn(string $hostId): string
    {
        $binding = ProjectBinding::findFirstServingOn($hostId);

        if ($binding === null) {
            $unbound = 'reads a project, and its host binds none';

            throw ScenarioInvalid::at($this->scenario->name, $this->stepsRun, $unbound);
        }

        return $binding->id;
    }

    public function holdStartRequest(string $requestId): void
    {
        $this->startRequest = $requestId;
        $this->turnsAsked = 1;
    }

    /**
     * A message was sent, which asks the session for one more turn.
     */
    public function askTurn(): void
    {
        $this->turnsAsked++;
    }

    /**
     * When the session of the agent the steps named last last showed life: a request of it moved on, its driver called
     * a hook, or a process working for it printed or changed; none while no step named an agent.
     */
    public function lastLifeAt(): CarbonImmutable|null
    {
        if ($this->lastAgent === null) {
            return null;
        }

        $session = (string) $this->lastAgent()->current_session_id;
        $moments = array_filter([
            DriverRequest::resolveLastMovedAtOf($session),
            HookCall::resolveLastAtOf($session),
            HostProcess::resolveLastMovedAtOfSession($session),
        ]);

        return $moments === [] ? null : max($moments);
    }

    /**
     * Why the session of the agent the steps named last ended, in the journal's own words, which carry a refused
     * start's reason; none while it runs or while no step named an agent.
     */
    public function endReason(): string|null
    {
        if ($this->lastAgent === null) {
            return null;
        }

        $session = AgentSession::query()->find($this->lastAgent()->current_session_id);

        if ($session === null || ! $session->hasEnded()) {
            return null;
        }

        return $session->end_evidence ?? 'it ended with no evidence';
    }

    /**
     * What the journal holds of the session of the agent the steps named last, in words: its state, its newest request
     * and its newest process with how it ended, so a play that gives up says what it saw.
     */
    public function sessionState(): string
    {
        if ($this->lastAgent === null) {
            return 'no step named an agent';
        }

        $sessionId = (string) $this->lastAgent()->current_session_id;
        $session = AgentSession::query()->find($sessionId);
        $request = DriverRequest::findNewestOf($sessionId);
        $process = HostProcess::findNewestOfSession($sessionId);

        return implode('; ', [
            $session === null ? 'no session' : "the session is {$session->status->value}",
            $request === null ? 'no request' : "its newest request {$request->operation->value} is "
                .$request->progress->value.($request->outcome === null ? '' : " ({$request->outcome->value})")
                .($request->refusal_reason === null ? '' : ", refused: {$request->refusal_reason->value}"),
            $process === null ? 'no process' : "its newest process {$process->purpose->value} is "
                .$process->status->value.($process->exit_evidence === null ? '' : ": {$process->exit_evidence}"),
        ]);
    }

    /**
     * How many turns the play asked of its session: the start's wake and each message sent since.
     */
    public function turnsAsked(): int
    {
        return $this->turnsAsked;
    }

    /**
     * The request id of the scenario's start, which its start and answering facts are about.
     *
     * @throws ScenarioInvalid
     */
    public function startRequest(): string
    {
        $missing = 'waits for a start before any step started one';

        return $this->startRequest ?? throw ScenarioInvalid::at($this->scenario->name, $this->stepsRun, $missing);
    }

    public function holdInstallerExit(int $exitCode): void
    {
        $this->installerExit = $exitCode;
    }

    public function installerExit(): int|null
    {
        return $this->installerExit;
    }

    public function signInAttempt(): string|null
    {
        return $this->signInAttempt;
    }

    /**
     * The key of the step running now in this play: a step is carried out once in it, and a play again carries it out
     * again rather than being answered with the earlier play's instruction.
     */
    public function stepKey(): string
    {
        $play = $this->startedAt->format('YmdHisv');

        return 'scenario-'.str_replace('/', '-', $this->scenario->name)."-{$play}-{$this->stepsRun}";
    }

    /**
     * The place of the step running now in the scenario, from 0.
     */
    public function stepIndex(): int
    {
        return $this->stepsRun;
    }

    public function stepRan(): void
    {
        $this->stepsRun++;
    }

    /**
     * The step the run plays next.
     */
    public function nextStep(): ScenarioStep
    {
        return $this->scenario->steps[$this->stepsRun];
    }

    public function isPlayedWhole(): bool
    {
        return $this->stepsRun >= count($this->scenario->steps);
    }

    public function holdSignInAttempt(string $attemptId): void
    {
        $this->signInAttempt = $attemptId;
    }

    /**
     * The code the user typed at an ask-user step, from the sign-in page the challenge showed.
     */
    public function holdSignInCode(string $code): void
    {
        $this->signInCode = $code;
    }

    /**
     * The sign-in attempt and its code a submit-code step answers.
     *
     * @return array{string, string}
     *
     * @throws ScenarioInvalid
     */
    public function challenge(): array
    {
        if ($this->signInAttempt === null || $this->signInCode === null) {
            $missing = 'submits a code no sign-in and ask-user gave';

            throw ScenarioInvalid::at($this->scenario->name, $this->stepsRun, $missing);
        }

        return [
            $this->signInAttempt,
            $this->signInCode,
        ];
    }
}
