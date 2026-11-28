<?php

declare(strict_types=1);

namespace Tests\Support\Recordings;

use App\Models\Drivers\DriverRequest;
use App\Models\Sessions\SessionProcess;
use App\Models\Hosts\HostProcess;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Models\Hosts\HostInstruction;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Recordings\Recordings;
use App\Recordings\Scenarios\Enums\ScenarioStepType;
use App\Recordings\Scenarios\Exceptions\ScenarioStuck;
use App\Recordings\Scenarios\Scenario;
use App\Recordings\Scenarios\ScenarioPlayer;
use App\Recordings\Scenarios\ScenarioRun;
use App\Recordings\Scenarios\ScenarioStep;
use App\Values\FilePath;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Contracts\Config\Repository;
use PHPUnit\Framework\Assert;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Seeding\TestJournal;

/**
 * One recorded scenario played through the test journal on a real contained host whose Docker daemon plays the
 * recording, its steps run as the owner as the recorder ran them; a call the recording does not hold, or one it holds
 * that is never asked, fails the test.
 */
final class TestScenario
{
    /**
     * The host the scenario is played on.
     */
    private const string HOST = 'Recorded';

    /**
     * The profile every agent of a scenario starts with, as the recorder makes them.
     */
    private const string AGENT_PROFILE = 'journal-worker';

    private ScenarioRun|null $run = null;

    /**
     * How long the restarted test host gets to allow its images again.
     */
    private const int HOST_RESTART_SECONDS = 60;

    public function __construct(private readonly TestJournal $journal, private readonly string $name) {}

    /**
     * Plays every step of the scenario on the host that plays its recording.
     */
    public function play(): self
    {
        return $this->playRest();
    }

    /**
     * Plays the steps up to and with the next one of the type named, such as send-message.
     */
    public function playThrough(string $step): self
    {
        $run = $this->run();

        do {
            Assert::assertFalse($run->isPlayedWhole(), "The scenario {$this->name} holds no {$step} step left to play.");
            $played = $this->playNext($run);
        } while ($played->stepType->value !== $step);

        return $this;
    }

    /**
     * Plays every step not yet played.
     */
    public function playRest(): self
    {
        $run = $this->run();

        while (! $run->isPlayedWhole()) {
            $this->playNext($run);
        }

        return $this;
    }

    /**
     * The orders the journal gave the host while the scenario played, against the recording's.
     *
     * @param  Closure(WireAssert): mixed  $scope
     */
    public function assertHostWire(Closure $scope): self
    {
        [$driver, $scenarioName] = explode('/', $this->name, 2);
        $recording = $this->journal->service(Recordings::class)->scenario($driver, $scenarioName);
        $host = $this->journal->hostCalled(self::HOST)->hostId;
        // An order's sequence counts within its process, so the orders go in the order they were made, by their ids.
        $orders = HostInstruction::query()->where('host_id', $host)->orderBy('id')->get()->all();
        $playing = PlayedScenario::of($this->name, $recording);
        // The playing host reads the profiles it names, so it names its own folder where the recorded machine named one.
        $profiles = [TestHost::containedEnvironment()['AGENTS_SECURITY_PROFILES'] => $playing->securityProfiles];
        $scope(WireAssert::ofHost($this->name, $recording, $orders, array_filter($profiles)));

        return $this;
    }

    /**
     * A played driver program read the text, as the journal typed it into its terminal: the journal keeps no typed
     * bytes once the host took them, so the played program's own reading is the proof.
     */
    public function assertTyped(string $text): self
    {
        $this->journal->testHost(fn (TestHost $host) => Assert::assertTrue(
            array_any($host->playedTyped(), fn (string $typed) => str_contains($typed, $text)),
            "The journal typed no {$text} while {$this->name} played; the programs read: "
                .implode(' | ', $host->playedTyped()),
        ));

        return $this;
    }

    /**
     * The host stops, and its played daemon was asked every call the recording holds and no other.
     */
    public function assertPlayedWhole(): self
    {
        Assert::assertNotNull($this->run, "The scenario {$this->name} was not played.");
        $this->journal->testHost(fn (TestHost $host) => Assert::assertSame([], $host->stop()->playedFailures()));

        return $this;
    }

    /**
     * The run of the scenario, made once: a contained host enrolled and running against the played daemon, under the
     * installation name of the recording, with its accounts chosen, its driver images ready and the scenario's agents.
     */
    private function run(): ScenarioRun
    {
        if ($this->run !== null) {
            return $this->run;
        }

        [$driver, $scenarioName] = explode('/', $this->name, 2);
        $recording = $this->journal->service(Recordings::class)->scenario($driver, $scenarioName);
        $playing = PlayedScenario::of($this->name, $recording);
        $scenario = Scenario::read($this->name, $this->journal->service(Files::class)->read(
            FilePath::in(Place::Project, Recordings::SCENARIOS."/{$this->name}.json"),
        ));

        $this->journal->arrangeContainedJournal();
        $this->journal->service(Repository::class)->set('journal.agents.installation_name', $playing->installationName);
        $this->journal->arrangeRecordedMachine($playing);
        $this->journal->enrollContainedHost(self::HOST, [base_path()])
            ->runPlayingTestHost(self::HOST, $playing, fn (TestHost $host) => $host->chooseActiveAccounts())
            ->readyRecordedDriverImagesOn(self::HOST, $playing->driverImages);
        $agents = [];

        foreach (array_unique(array_filter(array_map(fn ($step) => $step->agent, $scenario->steps))) as $agent) {
            $this->journal->idleAgent($agent, self::AGENT_PROFILE);
            $agents[$agent] = $this->journal->agentCalled($agent)->id;
        }

        return $this->run = new ScenarioRun($scenario, $this->journal->ownerUser(), $agents, $playing->agentImage);
    }

    /**
     * Plays the run's next step: a host restart restarts the playing test host and waits until it allowed its images
     * again, as the player restarts a machine's host; every other step the player plays.
     */
    private function playNext(ScenarioRun $run): ScenarioStep
    {
        $step = $run->nextStep();

        if ($step->stepType !== ScenarioStepType::RestartHost) {
            try {
                return $this->player()->playNext($run, $this->refuseAskingTheUser(...));
            } catch (ScenarioStuck $stuck) {
                // The played daemon's own record says which call the host made that the recording does not hold.
                $this->journal->testHost(fn (TestHost $host) => Assert::fail(
                    $stuck->getMessage()."\n".implode("\n", [
                        ...$host->playedFailures(),
                        ...$this->startState(),
                        $host->printed(),
                    ]),
                ));
            }
        }

        $restartedAt = CarbonImmutable::now();
        $this->journal->testHost(fn (TestHost $host) => $host->restartHost());
        $host = Host::query()->findOrFail($run->hostId());
        $deadline = microtime(true) + self::HOST_RESTART_SECONDS;

        while (! HostInstruction::hasAllowedSince($host, $restartedAt) || HostDriverImage::isAdmittingOn($host->id)) {
            if (microtime(true) > $deadline) {
                $this->journal->testHost(fn (TestHost $host) => Assert::fail(
                    'The test host did not allow its images again within '.self::HOST_RESTART_SECONDS." seconds:\n"
                    .implode("\n", [...$host->playedFailures(), $host->printed()]),
                ));
            }
            usleep(100_000);
        }

        $run->stepRan();

        return $step;
    }

    /**
     * What the journal holds of the run's start: each process the host was ordered to run and the start's own state,
     * one line each, for a stuck step to show where the start stopped.
     *
     * @return list<string>
     */
    private function startState(): array
    {
        $processes = HostProcess::query()->orderBy('created_at')->get()->all();
        $starts = SessionProcess::query()->supervised()->orderBy('created_at')->get()->all();
        $requests = DriverRequest::query()->orderBy('sequence')->get()->all();

        return [
            ...array_map(
                fn (HostProcess $process) => "process {$process->id} {$process->created_at?->format('H:i:s.v')} "
                    ."{$process->purpose->value} {$process->status->value} output {$process->output_offset} "
                    ."workers {$process->worker_generation} {$process->exit_evidence}",
                $processes,
            ),
            ...array_map(fn (SessionProcess $start) => "start {$start->status->value} {$start->refusal}", $starts),
            ...array_map(
                fn (DriverRequest $request) => "request {$request->operation->value} {$request->progress->value} "
                    ."{$request->outcome?->value} {$request->refusal_reason?->value}",
                $requests,
            ),
        ];
    }

    private function player(): ScenarioPlayer
    {
        return $this->journal->service(ScenarioPlayer::class);
    }

    private function refuseAskingTheUser(): never
    {
        Assert::fail("The scenario {$this->name} asks the user, which a test cannot answer.");
    }
}
