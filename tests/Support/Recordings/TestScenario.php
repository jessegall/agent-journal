<?php

declare(strict_types=1);

namespace Tests\Support\Recordings;

use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Models\Hosts\HostInstruction;
use App\Recordings\Recordings;
use App\Recordings\Scenarios\Scenario;
use App\Recordings\Scenarios\ScenarioPlayer;
use App\Recordings\Scenarios\ScenarioRun;
use App\Values\FilePath;
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
            $played = $this->player()->playNext($run, $this->refuseAskingTheUser(...));
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
            $this->player()->playNext($run, $this->refuseAskingTheUser(...));
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
        $orders = HostInstruction::query()->where('host_id', $host)->orderBy('sequence')->get()->all();
        $scope(WireAssert::ofHost($this->name, $recording, $orders));

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
        $this->journal->enrollContainedHost(self::HOST, [base_path()])
            ->runPlayingTestHost(self::HOST, $playing, fn (TestHost $host) => $host->chooseActiveAccounts())
            ->readyDriverImagesOn(self::HOST);
        $agents = [];

        foreach (array_unique(array_filter(array_map(fn ($step) => $step->agent, $scenario->steps))) as $agent) {
            $this->journal->idleAgent($agent, self::AGENT_PROFILE);
            $agents[$agent] = $this->journal->agentCalled($agent)->id;
        }

        return $this->run = new ScenarioRun($scenario, $this->journal->ownerUser(), $agents, TestHost::IMAGE);
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
