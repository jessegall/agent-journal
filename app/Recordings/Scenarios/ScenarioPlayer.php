<?php

declare(strict_types=1);

namespace App\Recordings\Scenarios;

use App\Accounts\Enums\CommandEntry;
use App\Accounts\SignInChallenges;
use App\Accounts\Values\SignInStarted;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Bus\Contracts\JournalCommands;
use App\Bus\Contracts\OwnerCommands;
use App\Bus\RequestKey;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Recordings\RecordingDrafts;
use App\Recordings\Scenarios\Enums\ScenarioFact;
use App\Recordings\Scenarios\Enums\ScenarioStepType;
use App\Recordings\Scenarios\Exceptions\ScenarioInvalid;
use App\Recordings\Scenarios\Exceptions\ScenarioStuck;
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
     * Where the player asks the record script for a machine change, under the drafts' folder.
     */
    public const string MACHINE_CHANGE = RecordingDrafts::DRAFTS.'/machine-change.args';

    public const string MACHINE_CHANGE_DONE = RecordingDrafts::DRAFTS.'/machine-change.done';

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

    public function __construct(
        private OwnerCommands $commands,
        private JournalCommands $journal,
        private DriverCatalogue $drivers,
        private SignInChallenges $challenges,
        private Sleeper $sleeper,
        private Files $files,
        private RequestKey $requestKey,
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
        foreach ($run->scenario->steps as $index => $step) {
            $began = microtime(true);
            $tell(sprintf('step %d: %s', $index + 1, $step->summary()));
            $this->playStep($run, $step, $askUser);
            $run->stepRan();
            $tell(sprintf('step %d done after %.1f s', $index + 1, microtime(true) - $began));
        }
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

        if ($step->stepType->isCommand()) {
            // A step is one request of the owner, so a command that runs only under a request key gets its own.
            $result = $this->requestKey->independently(
                strtolower((string) Str::ulid()),
                fn () => $this->commands->run($step->commandFor($run, $this->drivers)),
            );

            if ($result instanceof SignInStarted) {
                $run->holdSignInAttempt($result->attemptId);
            }

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
            }

            return;
        }

        $fact = $step->fact ?? throw ScenarioInvalid::at($run->scenario->name, $run->stepIndex(), 'waits for no fact');
        $this->waitFor($run, $fact, (int) $step->seconds);
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

            // A session that ended waits for nothing more: the play ends at once with the journal's own reason (user
            // 29751), so the cause reaches whoever runs it.
            $endReason = $run->endReason();

            if ($endReason !== null) {
                throw ScenarioStuck::ended($run->scenario->name, $run->stepIndex(), $fact, $endReason);
            }

            // A session that shows no life for a while waits for nothing more: the play ends at once (user 28825).
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
