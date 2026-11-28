<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings;

use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Files\Enums\Place;
use App\Hosts\HostProtocolCheck;
use App\Hosts\HostProtocolSources;
use App\Support\Recordings\CutExchange;
use App\Support\Recordings\Enums\Wire;
use App\Support\Recordings\Exceptions\HostProtocolDrifted;
use App\Support\Recordings\Exceptions\RecordedEnvironmentRefused;
use App\Support\Recordings\Exceptions\RecordingBreaksProtocol;
use App\Support\Recordings\Exceptions\RecordingLeaks;
use App\Support\Recordings\Exceptions\RecordingOutsideContainer;
use App\Support\Recordings\RecordedCall;
use App\Support\Recordings\RecordedEvent;
use App\Support\Recordings\RecordingFinisher;
use App\Support\Recordings\RecordingOpening;
use App\Support\Recordings\RecordingRun;
use App\Support\Recordings\Recordings;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Tests\Support\Files\UsesTemporaryPlaces;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A finished run becomes the scenario's recording folder only when every check holds: a drifted protocol, a call that
 * breaks it, a relay call, a leaked value, a session variable of the recording user and a driver outside the agent
 * image each refuse it, writing nothing and keeping the earlier folder; a good run's folder reads back as recorded.
 */
#[TimeLimit(10, 'The finisher checks the generated protocol, which formats it with Pint once.')]
final class RecordingFinisherTest extends TestCase
{
    use RefreshHookDatabase;
    use UsesTemporaryPlaces;

    private const string SCENARIO = 'claude-code/terminal-turn';

    private string $project;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $sources = array_keys($this->app->make(HostProtocolCheck::class)->sources());
        $this->project = $this->placeInTemporaryFolder(Place::Project);
        config(['journal.agents.agent_image' => 'journal-runner@sha256:1']);
        // The agent image's digest is fixed for the test, so a test of another process changing the checkout meanwhile
        // never makes the run's own recording read as stale.
        Process::fake(['*'.Config::string('journal.recordings.image_build_script').'*' => Process::result('image-programs-digest')]);

        foreach ([HostProtocolSources::PROTOCOL_FILE, ...$sources] as $relative) {
            File::ensureDirectoryExists(dirname("{$this->project}/{$relative}"));
            File::copy(base_path($relative), "{$this->project}/{$relative}");
        }

        File::ensureDirectoryExists("{$this->project}/".Recordings::SCENARIOS.'/claude-code');
        File::put("{$this->project}/".Recordings::SCENARIOS.'/'.self::SCENARIO.'.json', '{"steps":[]}');
        $build = $this->app->make(PinnedBuilds::class)->versionOf('claude-code');
        $this->folder = "{$this->project}/".Recordings::FOLDER."/claude-code/{$build}/terminal-turn";
        File::ensureDirectoryExists($this->folder);
        File::put("{$this->folder}/earlier.txt", 'the earlier recording');
    }

    public function test_a_good_run_writes_a_folder_the_recordings_read_back(): void
    {
        $this->app->make(RecordingFinisher::class)->finish($this->runOf([$this->hostExchange([$this->heartbeat()])]));

        $recording = $this->app->make(Recordings::class)->scenario('claude-code', 'terminal-turn');

        $this->assertSame([false, ['/host/heartbeat']], [
            File::exists("{$this->folder}/earlier.txt"),
            array_map(fn (RecordedCall $call) => $call->path, $recording->calls(Wire::Host)),
        ]);
    }

    public function test_a_drifted_protocol_refuses_the_run(): void
    {
        File::delete("{$this->project}/app/Hosts/Protocol/HostRoute.php");

        $this->assertRefusedKeepingTheEarlierFolder(HostProtocolDrifted::class, fn () => $this->runOf([
            $this->hostExchange([$this->heartbeat()]),
        ]));
    }

    public function test_a_call_breaking_the_protocol_refuses_the_run(): void
    {
        $this->assertRefusedKeepingTheEarlierFolder(RecordingBreaksProtocol::class, fn () => $this->runOf([
            $this->hostExchange([$this->claimed([$this->instruction('resize', 'p-1', ['columns' => 80])])]),
        ]));
    }

    public function test_a_relay_call_refuses_the_run(): void
    {
        $presence = RecordedCall::askedBy(Request::create('/host/bindings/b-1/presence', 'POST', content: '{}'));

        $this->assertRefusedKeepingTheEarlierFolder(RecordingBreaksProtocol::class, fn () => $this->runOf([
            $this->hostExchange([RecordedEvent::asked(10, $presence)]),
        ]));
    }

    public function test_a_leaked_value_refuses_the_run(): void
    {
        $leaky = RecordedCall::askedBy(Request::create('/host/heartbeat', 'POST', content: (string) json_encode([
            'live_processes' => ['plain-real-value-42'],
        ])));

        $this->assertRefusedKeepingTheEarlierFolder(RecordingLeaks::class, fn () => $this->runOf([
            $this->hostExchange([RecordedEvent::asked(10, $leaky)], ['SESSION_NAME' => 'plain-real-value-42']),
        ]));
    }

    public function test_a_session_variable_of_the_recording_user_refuses_the_run(): void
    {
        $this->assertRefusedKeepingTheEarlierFolder(RecordedEnvironmentRefused::class, fn () => $this->runOf([
            $this->hostExchange([$this->heartbeat()], ['ITERM_SESSION_ID' => 'w0t0p0']),
        ]));
    }

    public function test_a_driver_outside_the_agent_image_refuses_the_run(): void
    {
        $plan = ['type' => 'pipe', 'restart' => 'never', 'argv' => ['claude'], 'restart_argv' => [],
            'restart_when_file' => null, 'environment' => [], 'folder' => '/workspace', 'container' => null,
            'labels' => null, 'size' => ['columns' => 80, 'rows' => 24], 'files' => [], 'folders' => [],
            'inherit' => [], 'side_sockets' => []];

        $this->assertRefusedKeepingTheEarlierFolder(RecordingOutsideContainer::class, fn () => $this->runOf([
            $this->hostExchange([$this->claimed([$this->instruction('open_process', 'p-1', $plan)])]),
        ]));
    }

    /**
     * @param  class-string<\Throwable>  $refusal
     * @param  Closure(): RecordingRun  $run
     */
    private function assertRefusedKeepingTheEarlierFolder(string $refusal, Closure $run): void
    {
        $this->assertThrows(fn () => $this->app->make(RecordingFinisher::class)->finish($run()), $refusal);
        $this->assertSame(
            [true, false],
            [File::exists("{$this->folder}/earlier.txt"), File::isDirectory("{$this->folder}.next")],
        );
    }

    /**
     * @param  list<CutExchange>  $exchanges
     */
    private function runOf(array $exchanges): RecordingRun
    {
        return new RecordingRun(self::SCENARIO, 0, 1_000, $exchanges);
    }

    /**
     * The host's exchange of calls, its opening given the environment.
     *
     * @param  list<RecordedEvent>  $events
     * @param  array<string, string>  $environment
     */
    private function hostExchange(array $events, array $environment = []): CutExchange
    {
        $opening = RecordingOpening::fromLine([
            ...RecordingOpening::ofCalls(Wire::Host, 'caller-1')->jsonSerialize(),
            'environment' => $environment,
            'openedAt' => 0,
        ]);

        return new CutExchange($opening, $events, null);
    }

    private function heartbeat(): RecordedEvent
    {
        $request = Request::create('/host/heartbeat', 'POST', content: '{"live_processes":[]}');

        return RecordedEvent::asked(10, RecordedCall::askedBy($request));
    }

    /**
     * @param  list<array<string, mixed>>  $instructions
     */
    private function claimed(array $instructions): RecordedEvent
    {
        $claim = ['instructions' => $instructions, 'idle_window_seconds' => 60, 'now' => '2026-11-27T08:00:00Z'];
        $request = Request::create('/host/instructions/claim', 'POST');

        $answer = RecordedCall::answeredWith(new Response((string) json_encode($claim)), $request);

        return RecordedEvent::answered(20, $answer);
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function instruction(string $type, string $processId, array $payload): array
    {
        return [
            'id' => '00000000000000000000000001',
            'sequence' => 1,
            'type' => $type,
            'process_id' => $processId,
            'payload' => (string) json_encode($payload),
            'expires_at' => '2026-11-27T08:01:00Z',
            'signature' => 'signed',
        ];
    }
}
