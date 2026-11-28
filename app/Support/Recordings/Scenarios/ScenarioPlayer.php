<?php

declare(strict_types=1);

namespace App\Support\Recordings\Scenarios;

use App\Accounts\Enums\CommandEntry;
use App\Accounts\SignInChallenges;
use App\Accounts\Values\SignInStarted;
use App\Agents\AgentStartOnMessage;
use App\Agents\Commands\WakeAgent\WakeAgentCommand;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Bus\ConsoleOwner;
use App\Bus\Contracts\JournalCommands;
use App\Bus\Contracts\OwnerCommands;
use App\Bus\RequestKey;
use App\Connections\PublishedReleases;
use App\Connections\ServerOrigin;
use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\ProcessFeed;
use App\Hosts\Protocol\HostProcessType;
use App\Inboxes\Commands\OpenInbox\OpenInboxCommand;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Hosts\HostInstruction;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Projects\Values\IssuedInvitation;
use App\Support\ActorReference;
use App\Support\KeyScripts\ScreenKeys;
use App\Support\Recordings\RecordingDrafts;
use App\Support\Recordings\Scenarios\Enums\ScenarioFact;
use App\Support\Recordings\Scenarios\Enums\ScenarioStepType;
use App\Support\Recordings\Scenarios\Exceptions\ScenarioInvalid;
use App\Support\Recordings\Scenarios\Exceptions\ScenarioStuck;
use App\Time\Contracts\Sleeper;
use App\Values\FilePath;
use App\Values\SignInChallenge;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Support\Str;

/**
 * Plays a scenario's steps in order as the owner: each command step through the bus, each wait until its fact is
 * reached or its seconds run out, each ask-user through the user's line, and each machine change through the record
 * script, which runs it on the machine and writes its exit code back beside the drafts.
 */
final readonly class ScenarioPlayer
{
    /**
     * How long an ask step waits for the user to sign in on the journal's page when they typed nothing.
     */
    private const int SIGN_IN_IN_PAGE_SECONDS = 900;

    /**
     * Where the player asks the record script for a machine change, under the drafts' folder.
     */
    public const string MACHINE_CHANGE = RecordingDrafts::DRAFTS.'/machine-change.args';

    public const string MACHINE_CHANGE_DONE = RecordingDrafts::DRAFTS.'/machine-change.done';

    public const string CONNECTION_TICKET = RecordingDrafts::DRAFTS.'/connection-ticket';

    /**
     * How long the player waits between two looks at a fact or a machine change.
     */
    private const int LOOK_NANOSECONDS = 500_000_000;

    /**
     * How many looks, half a second apart, an ask-user step gives the sign-in's link to be kept.
     */
    private const int LINK_LOOKS = 20;

    /**
     * The journal instructs a host what no session instructions, as its own host control does.
     */
    private const string TRUSTED_ENTRY = 'recorded scenarios';

    /**
     * The most seconds a machine change runs, an installation the longest of them.
     */
    private const int MACHINE_CHANGE_SECOND_LIMIT = 1200;

    /**
     * How long a waiting play lets its session show no life before it ends the play as stuck.
     */
    private const int QUIET_SECOND_LIMIT = 20;

    public const string CONNECT_PROJECT = 'connect-recorded-project';

    public const string START_TERMINAL = 'start-recorded-terminal';

    /**
     * The paired inbox for a message between the owner and the agent.
     */
    private const string PAIR_PROVIDER = 'recordings.pair';

    /**
     * The command line that restarts the local host, run by the record script on the machine.
     */
    private const array HOST_RESTART = [
        'docker',
        'compose',
        'restart',
        'agent-host',
    ];

    /**
     * How long a restarted host may take to allow its images again.
     */
    private const int HOST_RESTART_SECOND_LIMIT = 120;

    private const int TERMINAL_HOOK_SECOND_LIMIT = 180;

    public function __construct(
        private OwnerCommands $commands,
        private JournalCommands $journal,
        private DriverCatalogue $drivers,
        private SignInChallenges $challenges,
        private Sleeper $sleeper,
        private Files $files,
        private RequestKey $requestKey,
        private ConsoleOwner $owner,
        private AgentStartOnMessage $starts,
        private ServerOrigin $origin,
        private PublishedReleases $releases,
        private ProcessFeed $feed,
        private ScreenKeys $screenKeys,
        private RecordingDrafts $drafts,
    ) {}

    /**
     * Plays every step of the run's scenario; the user answers an ask-user step through the closure, which gets the
     * pause and answers the line the user typed.
     *
     * @param  Closure(ScenarioPause): string  $askUser
     * @param  Closure(string): void  $tell  hears a line for each step as it begins and ends, for whoever watches
     *
     * @throws ScenarioStuck
     * @throws ScenarioInvalid
     */
    public function play(ScenarioRun $run, Closure $askUser, Closure $tell): void
    {
        while (! $run->isPlayedWhole()) {
            $began = microtime(true);
            $number = $run->stepIndex() + 1;
            $tell(sprintf('step %d: %s', $number, $run->nextStep()->summary()));
            $this->playNext($run, $askUser);
            $tell(sprintf('step %d done after %.1f s', $number, microtime(true) - $began));
        }
    }

    /**
     * Restarts the local host through the record script and waits until it allowed and checked its images again, so a
     * recording that begins with it holds the start a fresh host makes: its inventory, its image allow and checks.
     *
     * @throws ScenarioStuck
     */
    private function restartHost(ScenarioRun $run): void
    {
        $restartedAt = CarbonImmutable::now();
        $exitCode = $this->changeMachine(self::HOST_RESTART);

        if ($exitCode !== 0) {
            throw ScenarioStuck::hostNotRestarted($run->scenario->name, $exitCode);
        }

        $host = Host::query()->findOrFail($run->hostId());
        $looks = intdiv(self::HOST_RESTART_SECOND_LIMIT * 1_000_000_000, self::LOOK_NANOSECONDS);

        for ($look = 0; $look <= $looks; $look++) {
            if (HostInstruction::hasAllowedSince($host, $restartedAt) && ! HostDriverImage::isAdmittingOn($host->id)) {
                return;
            }

            $this->sleeper->sleep(self::LOOK_NANOSECONDS);
        }

        throw ScenarioStuck::hostNotBack($run->scenario->name, self::HOST_RESTART_SECOND_LIMIT);
    }

    /**
     * Plays the run's next step and answers it.
     *
     * @param  Closure(ScenarioPause): string  $askUser
     * @param  (Closure(list<string>): int)|null  $changeMachine
     *
     * @throws ScenarioStuck
     * @throws ScenarioInvalid
     */
    public function playNext(ScenarioRun $run, Closure $askUser, Closure|null $changeMachine = null): ScenarioStep
    {
        $step = $run->nextStep();

        if ($step->startsOwnTerminal()) {
            $this->startTerminal($run, $step, $changeMachine ?? $this->changeMachine(...));
        } else {
            $this->playStep($run, $step, $askUser);
        }

        $run->stepRan();

        return $step;
    }

    /**
     * @param  Closure(ScenarioPause): string  $askUser
     *
     * @throws ScenarioStuck
     */
    private function playStep(ScenarioRun $run, ScenarioStep $step, Closure $askUser): void
    {
        if ($step->stepType->isHostInstruction()) {
            $instruction = $step->commandFor($run, $this->drivers);
            $this->journal->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $instruction);

            return;
        }

        // A code the user already submitted on the journal's page is not submitted again.
        if ($step->stepType === ScenarioStepType::SubmitCode && $run->isSignedInOnPage()) {
            return;
        }

        if ($step->stepType === ScenarioStepType::SendToAgent) {
            $this->sendToAgent($run, $step);

            return;
        }

        if ($step->stepType->isCommand()) {
            // A step is one request of the owner, so a command that runs only under a request key gets its own.
            $result = $this->requestKey->independently(
                strtolower((string) Str::ulid()),
                fn () => $this->commands->run($step->commandFor($run, $this->drivers)),
            );

            if ($result instanceof SignInStarted) {
                $run->holdSignInAttempt($result->attemptId);
            }

            if ($result instanceof ActorReference) {
                $run->holdAgent((string) $step->agent, $result->id);
            }

            if ($result instanceof IssuedInvitation) {
                $this->connectProject($run, $this->changeMachine(...));
            }

            return;
        }

        if ($step->stepType === ScenarioStepType::RestartHost) {
            $this->restartHost($run);

            return;
        }

        if ($step->stepType->isMachineChange()) {
            $exitCode = $this->changeMachine($step->machineChange($run));

            $isInstaller = in_array($step->stepType, [
                ScenarioStepType::Install,
                ScenarioStepType::Update,
                ScenarioStepType::Heal,
            ], true);

            if ($isInstaller) {
                $run->holdInstallerExit($exitCode);
            }

            return;
        }

        if ($step->stepType === ScenarioStepType::AskUser) {
            $typed = trim($askUser($step->pause($this->signInChallengeOf($run))));

            if ($typed !== '') {
                $run->holdSignInCode($typed);

                return;
            }

            // Nothing typed: the user answers the sign-in in the journal's own page, which ends it as the
            // scenario's next fact says: signed in, or refused.
            $this->waitFor($run, $run->nextFact() ?? ScenarioFact::SignedIn, self::SIGN_IN_IN_PAGE_SECONDS);
            $run->holdSignedInOnPage();

            return;
        }

        if ($step->stepType === ScenarioStepType::SendKeys) {
            $this->sendKeys($run, $step);

            return;
        }

        $fact = $step->fact ?? throw ScenarioInvalid::at($run->scenario->name, $run->stepIndex(), 'waits for no fact');
        $this->waitFor($run, $fact, (int) $step->seconds);
    }

    private function sendKeys(ScenarioRun $run, ScenarioStep $step): void
    {
        $agent = $run->agentNamed((string) $step->agent);
        $process = HostProcess::findNewestOfSession((string) $agent->current_session_id);

        if ($process === null || $process->type !== HostProcessType::Terminal) {
            throw ScenarioInvalid::at($run->scenario->name, $run->stepIndex(), "{$agent->name} has no terminal");
        }

        $frame = $this->feed->latestFrame($process->id);

        if ($frame === null || $frame->rows === []) {
            throw ScenarioInvalid::at($run->scenario->name, $run->stepIndex(), "{$agent->name} has no terminal frame");
        }

        $sentAfter = RecordingDrafts::moment();
        $instruction = $this->screenKeys->send($process, $frame, (string) $step->text, self::TRUSTED_ENTRY);

        $this->waitForKeys($run, $instruction, $step->from, $sentAfter);
    }

    private function waitForKeys(ScenarioRun $run, string $instruction, string|null $source, int $sentAfter): void
    {
        $looks = intdiv(self::TERMINAL_HOOK_SECOND_LIMIT * 1_000_000_000, self::LOOK_NANOSECONDS);

        for ($look = 0; $look <= $looks; $look++) {
            $keys = HostInstruction::query()->findOrFail($instruction);

            if ($keys->status === HostInstructionStatus::Refused) {
                throw ScenarioStuck::keysRefused($run, (string) $keys->refusal?->value);
            }

            if ($keys->status === HostInstructionStatus::Done
                && ($source === null || $this->drafts->hasSessionStart($source, $sentAfter))) {
                return;
            }

            $this->sleeper->sleep(self::LOOK_NANOSECONDS);
        }

        throw ScenarioStuck::keysNotObserved($run, $source);
    }

    /**
     * @param  Closure(list<string>): int  $changeMachine
     */
    private function startTerminal(ScenarioRun $run, ScenarioStep $step, Closure $changeMachine): void
    {
        if (! $run->isConnected()) {
            $this->requestKey->independently($run->stepKey(), fn () => $this->commands->run($run->issueConnection()));
            $this->connectProject($run, $changeMachine);
            $this->waitFor($run, ScenarioFact::Connected, self::HOST_RESTART_SECOND_LIMIT);
        }

        $agent = $run->useConnectedMainAgent((string) $step->agent);
        $previous = $agent->current_session_id;
        $status = $changeMachine([
            self::START_TERMINAL,
            $run->scenario->driver(),
            $step->startModel($run),
            (string) $step->effort,
        ]);

        if ($status !== 0) {
            throw ScenarioStuck::terminalNotStarted($run->scenario->name, $status);
        }

        $looks = intdiv(self::HOST_RESTART_SECOND_LIMIT * 1_000_000_000, self::LOOK_NANOSECONDS);

        for ($look = 0; $look <= $looks; $look++) {
            $session = $agent->refresh()->current_session_id;

            if ($session !== null && $session !== $previous) {
                $key = strtolower((string) Str::ulid());
                $run->holdStartRequest($key);
                $wake = new WakeAgentCommand($agent->id, $session, $key);
                $this->requestKey->independently($key, fn () => $this->commands->run($wake));

                return;
            }

            $this->sleeper->sleep(self::LOOK_NANOSECONDS);
        }

        throw ScenarioStuck::terminalNotStarted($run->scenario->name, $status);
    }

    /**
     * @param  Closure(list<string>): int  $changeMachine
     */
    private function connectProject(ScenarioRun $run, Closure $changeMachine): void
    {
        $ticket = $run->holdConnectionAttempt();
        $file = FilePath::in(Place::Project, self::CONNECTION_TICKET);

        $this->files->write($file, $ticket->secret."\n", Permissions::OwnerOnly);

        try {
            $status = $changeMachine([self::CONNECT_PROJECT]);
        } finally {
            $this->files->delete($file);
        }

        if ($status !== 0) {
            throw ScenarioStuck::projectNotConnected($run->scenario->name, $status);
        }
    }

    /**
     * Sends a message under one request key: the agent is started first on the choice kept
     * for its next start when it runs no session, then the message is posted in its inbox with the owner.
     *
     * @throws ScenarioInvalid
     */
    private function sendToAgent(ScenarioRun $run, ScenarioStep $step): void
    {
        $agent = $run->agentNamed((string) $step->agent);
        $owner = ActorReference::of($run->owner);

        $members = [
            $owner,
            ActorReference::of($agent),
        ];

        $inbox = $this->requestKey->independently(
            strtolower((string) Str::ulid()),
            fn () => $this->commands->run(new OpenInboxCommand(
                self::PAIR_PROVIDER,
                implode('|', array_map(fn (ActorReference $member) => $member->text(), $members)),
                $agent->name,
                $members,
            )),
        );

        $key = strtolower((string) Str::ulid());

        $this->requestKey->independently($key, function () use ($run, $step, $agent, $inbox, $key): void {
            $this->owner->actAsOwner();

            try {
                $isStarted = $this->starts->prepare($agent->id, null);
            } finally {
                $this->owner->finish();
            }

            // The start's own wake is the turn that reads the message; a running session takes one more turn.
            if ($isStarted) {
                $run->holdStartRequest($key);
            } else {
                $run->askTurn();
            }

            $this->commands->run(new SendMessageCommand($inbox, (string) $step->text));
        });
    }

    /**
     * @throws ScenarioStuck
     */
    private function waitFor(ScenarioRun $run, ScenarioFact $fact, int $seconds): void
    {
        $looks = intdiv($seconds * 1_000_000_000, self::LOOK_NANOSECONDS);

        $began = CarbonImmutable::now();

        for ($look = 0; $look <= $looks; $look++) {
            if ($fact->isReached($run)) {
                return;
            }

            if (! $fact->isAboutSession()) {
                $this->sleeper->sleep(self::LOOK_NANOSECONDS);

                continue;
            }

            // A session that ended waits for nothing more: the play ends at once with the journal's own reason (user
            // 29751), so the cause reaches whoever runs it.
            $endReason = $run->endReason();

            if ($endReason !== null) {
                throw ScenarioStuck::ended($run->scenario->name, $run->stepIndex(), $fact, $endReason);
            }

            // A session that shows no life for a while waits for nothing more: the play ends at once.
            $life = $run->lastLifeAt();
            $quietSeconds = $life === null ? 0 : max($life, $began)->diffInSeconds(CarbonImmutable::now());
            $isQuiet = $quietSeconds > self::QUIET_SECOND_LIMIT;

            if ($isQuiet) {
                throw ScenarioStuck::quiet($run, $fact, self::QUIET_SECOND_LIMIT);
            }

            $this->sleeper->sleep(self::LOOK_NANOSECONDS);
        }

        throw ScenarioStuck::at($run->scenario->name, $run->stepIndex(), $fact, $seconds);
    }

    /**
     * Asks the record script for the machine change, one argument to a line, and waits for its exit code.
     *
     * @param  list<string>  $argv
     *
     * @throws ScenarioStuck
     */
    private function changeMachine(array $argv): int
    {
        if ($argv === [self::CONNECT_PROJECT]) {
            $argv = [...$argv, $this->origin->canonical(), $this->releases->current()->version];
        }

        $request = FilePath::in(Place::Project, self::MACHINE_CHANGE);
        $done = FilePath::in(Place::Project, self::MACHINE_CHANGE_DONE);
        $this->files->write($request, implode("\n", $argv)."\n");
        $looks = intdiv(self::MACHINE_CHANGE_SECOND_LIMIT * 1_000_000_000, self::LOOK_NANOSECONDS);

        for ($look = 0; $look <= $looks; $look++) {
            if ($this->files->exists($done)) {
                $exitCode = (int) trim($this->files->read($done));
                $this->files->delete($done);

                return $exitCode;
            }

            $this->sleeper->sleep(self::LOOK_NANOSECONDS);
        }

        throw ScenarioStuck::machineChangeUnanswered(implode(' ', $argv), self::MACHINE_CHANGE_SECOND_LIMIT);
    }

    /**
     * The challenge of the run's sign-in, waited for a moment: the attempt shows as waiting just before its challenge
     * is kept.
     */
    private function signInChallengeOf(ScenarioRun $run): SignInChallenge|null
    {
        $attempt = $run->signInAttempt();

        if ($attempt === null) {
            return null;
        }

        for ($look = 0; $look < self::LINK_LOOKS; $look++) {
            $challenge = $this->challenges->challengeOf($attempt);

            if ($challenge !== null) {
                return $challenge;
            }

            $this->sleeper->sleep(self::LOOK_NANOSECONDS);
        }

        return null;
    }
}
