<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings;

use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Files\Enums\Place;
use App\Support\Recordings\AgentImageBuild;
use App\Support\Recordings\Enums\StaleReason;
use App\Support\Recordings\Enums\Wire;
use App\Support\Recordings\Exceptions\RecordingMissing;
use App\Support\Recordings\Exceptions\RecordingStale;
use App\Support\Recordings\RecordedCall;
use App\Support\Recordings\RecordedEvent;
use App\Support\Recordings\RecordingManifest;
use App\Support\Recordings\RecordingOpening;
use App\Support\Recordings\Recordings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Tests\Support\Files\UsesTemporaryPlaces;
use Tests\TestCase;

/**
 * A recorded scenario is read with its exchanges and the calls on each wire; one never recorded fails as missing, and
 * one whose scenario changed since fails as stale, naming the reason.
 */
final class RecordingsTest extends TestCase
{
    use UsesTemporaryPlaces;

    private string $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->project = $this->placeInTemporaryFolder(Place::Project);
        $this->writeDefinition('{"steps":[]}');
    }

    public function test_a_recorded_scenario_is_read_with_its_exchanges_and_calls(): void
    {
        $this->writeRecording($this->digestOf('{"steps":[]}'));

        $recording = $this->app->make(Recordings::class)->scenario('claude-code', 'terminal-turn');

        $this->assertSame(
            [['01-host'], [], ['/host/heartbeat']],
            [
                $recording->exchangesOn(Wire::Host),
                $recording->exchangesOn(Wire::Docker),
                array_map(fn (RecordedCall $call) => $call->path, $recording->calls(Wire::Host)),
            ],
        );
    }

    public function test_a_scenario_never_recorded_fails_as_missing(): void
    {
        $this->expectException(RecordingMissing::class);

        $this->app->make(Recordings::class)->scenario('claude-code', 'terminal-turn');
    }

    public function test_a_scenario_changed_since_its_recording_fails_as_stale_naming_why(): void
    {
        $this->writeRecording($this->digestOf('{"steps":["an earlier step"]}'));

        $this->expectExceptionObject(RecordingStale::of('claude-code/terminal-turn', StaleReason::Scenario));

        $this->app->make(Recordings::class)->scenario('claude-code', 'terminal-turn');
    }

    private function writeDefinition(string $definition): void
    {
        File::ensureDirectoryExists("{$this->project}/".Recordings::SCENARIOS.'/claude-code');
        File::put("{$this->project}/".Recordings::SCENARIOS.'/claude-code/terminal-turn.json', $definition);
    }

    private function digestOf(string $definition): string
    {
        return hash('sha256', $definition);
    }

    /**
     * The scenario's recording for the pinned build, made from a definition of the digest: one host exchange of one
     * heartbeat.
     */
    private function writeRecording(string $definitionDigest): void
    {
        $build = $this->app->make(PinnedBuilds::class)->versionOf('claude-code');
        $folder = "{$this->project}/".Recordings::FOLDER."/claude-code/{$build}/terminal-turn";
        $manifest = RecordingManifest::of(
            $definitionDigest,
            'claude-code',
            $build,
            $this->app->make(AgentImageBuild::class)->hash(),
            '2026-11-27T08:00:00Z',
            ['01-host'],
        );
        $request = Request::create('/host/heartbeat', 'POST', content: '{"live_processes":[]}');
        $heartbeat = RecordedCall::askedBy($request);
        $fixture = [
            'opening' => RecordingOpening::ofCalls(Wire::Host, '01-host'),
            'events' => [RecordedEvent::asked(1, $heartbeat)],
            'exit_code' => null,
        ];

        File::ensureDirectoryExists("{$folder}/exchanges/01-host");
        File::put("{$folder}/scenario.json", (string) json_encode($manifest));
        File::put("{$folder}/exchanges/01-host/exchange.json", (string) json_encode($fixture));
    }
}
