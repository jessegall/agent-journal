<?php

declare(strict_types=1);

namespace Tests\Machinery\Recordings;

use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Console\Commands\PlayScenarioCommand;
use App\Files\Enums\Place;
use App\Hosts\HostProtocolCheck;
use App\Hosts\HostProtocolSources;
use App\Recordings\AgentImagePrograms;
use App\Recordings\RecordingDrafts;
use App\Recordings\Recordings;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Testing\PendingCommand;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Files\UsesTemporaryPlaces;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * recordings:play refuses while recording is off, refuses an invalid scenario before any step runs, keeps the drafts
 * of a scenario stuck at a fact, and writes the recording of a scenario played to its end.
 */
#[TimeLimit(10, 'A played scenario is finished, which checks the generated protocol with Pint once.')]
#[TestsMachinery(PlayScenarioCommand::class)]
final class PlayScenarioCommandTest extends TestCase
{
    use RefreshHookDatabase;
    use UsesTemporaryPlaces;

    private string $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
        $sources = array_keys($this->app->make(HostProtocolCheck::class)->sources());
        $this->project = $this->placeInTemporaryFolder(Place::Project);
        Process::fake(['*'.AgentImagePrograms::SCRIPT.'*' => Process::result('image-programs-digest')]);

        foreach ([HostProtocolSources::PROTOCOL_FILE, ...$sources] as $relative) {
            File::ensureDirectoryExists(dirname("{$this->project}/{$relative}"));
            File::copy(base_path($relative), "{$this->project}/{$relative}");
        }
    }

    public function test_recording_off_refuses_the_play(): void
    {
        $this->writeScenario('claude-code/empty', '{"steps":[]}');

        $this->play('claude-code/empty')->expectsOutputToContain('Recording is off')->assertFailed();
    }

    public function test_an_invalid_scenario_is_refused_before_any_step_runs(): void
    {
        $this->journal->switchRecordingOn();
        $this->writeScenario('claude-code/dance', '{"steps":[{"do":"stop-daemon"},{"do":"dance"}]}');

        $this->play('claude-code/dance')->expectsOutputToContain('step 2')->assertFailed();
        $this->assertFalse(File::exists("{$this->project}/".RecordingDrafts::DRAFTS.'/run.json'));
    }

    public function test_a_scenario_stuck_at_a_fact_keeps_its_drafts(): void
    {
        $this->journal->switchRecordingOn();
        $this->writeScenario('claude-code/stuck', '{"steps":[{"do":"wait-for","fact":"challenge-shown","seconds":0}]}');

        $this->play('claude-code/stuck')->expectsOutputToContain('stuck at step 1')->assertFailed();
        $this->assertTrue(File::exists("{$this->project}/".RecordingDrafts::DRAFTS.'/run.json'));
    }

    public function test_a_scenario_played_to_its_end_writes_its_recording(): void
    {
        $this->journal->switchRecordingOn();
        $this->writeScenario('claude-code/empty', '{"steps":[]}');
        $build = $this->app->make(PinnedBuilds::class)->versionOf('claude-code');

        $this->play('claude-code/empty')->expectsOutputToContain('Recorded claude-code/empty')->assertSuccessful();
        $folder = "{$this->project}/".Recordings::FOLDER."/claude-code/{$build}/empty";
        $this->assertTrue(File::exists("{$folder}/scenario.json"));
    }

    private function writeScenario(string $name, string $file): void
    {
        File::ensureDirectoryExists(dirname("{$this->project}/".Recordings::SCENARIOS."/{$name}.json"));
        File::put("{$this->project}/".Recordings::SCENARIOS."/{$name}.json", $file);
    }

    private function play(string $scenario): PendingCommand
    {
        $owner = $this->journal->ownerUser()->email;

        return $this->artisan('recordings:play', ['scenario' => $scenario, '--owner' => $owner]);
    }
}
