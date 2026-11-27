<?php

declare(strict_types=1);

namespace App\Recordings\Scenarios;

use App\Accounts\SignInChallenges;
use App\Accounts\Values\SignInStarted;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Bus\Contracts\OwnerCommands;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Recordings\RecordingDrafts;
use App\Recordings\Scenarios\Enums\ScenarioFact;
use App\Recordings\Scenarios\Enums\ScenarioStepType;
use App\Recordings\Scenarios\Exceptions\ScenarioInvalid;
use App\Recordings\Scenarios\Exceptions\ScenarioStuck;
use App\Time\Contracts\Sleeper;
use App\Values\FilePath;
use Closure;

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
     * The most seconds a machine change runs, an installation the longest of them.
     */
    private const int MACHINE_CHANGE_SECOND_LIMIT = 1200;

    public function __construct(
        private OwnerCommands $commands,
        private DriverCatalogue $drivers,
        private SignInChallenges $challenges,
        private Sleeper $sleeper,
        private Files $files,
    ) {}

    /**
     * Plays every step of the run's scenario; the user answers an ask-user step through the closure, which gets the
     * pause and answers the line the user typed.
     *
     * @param  Closure(ScenarioPause): string  $askUser
     *
     * @throws ScenarioStuck
     * @throws ScenarioInvalid
     */
    public function play(ScenarioRun $run, Closure $askUser): void
    {
        foreach ($run->scenario->steps as $step) {
            $this->playStep($run, $step, $askUser);
            $run->stepRan();
        }
    }

    /**
     * @param  Closure(ScenarioPause): string  $askUser
     *
     * @throws ScenarioStuck
     */
    private function playStep(ScenarioRun $run, ScenarioStep $step, Closure $askUser): void
    {
        if ($step->stepType->isCommand()) {
            $result = $this->commands->run($step->commandFor($run, $this->drivers));

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
            $attempt = $run->signInAttempt();
            $link = $attempt === null ? null : $this->challenges->challengeOf($attempt)?->address;
            $typed = trim($askUser($step->pause($link)));

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

        for ($look = 0; $look <= $looks; $look++) {
            if ($fact->isReached($run)) {
                return;
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
}
