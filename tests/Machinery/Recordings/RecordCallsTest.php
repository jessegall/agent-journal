<?php

declare(strict_types=1);

namespace Tests\Machinery\Recordings;

use App\Files\Enums\Place;
use App\Http\Middleware\RecordCalls;
use App\Recordings\RecordingDrafts;
use App\Recordings\Scenarios\Scenario;
use Illuminate\Support\Facades\File;
use Illuminate\Testing\TestResponse;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Files\UsesTemporaryPlaces;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The tap on the host's calls: while recording is off a call passes untouched and nothing is written; within a run
 * each call is kept as asked and as answered, a refused one too, with no signature or credential header.
 */
#[TestsMachinery(RecordCalls::class)]
final class RecordCallsTest extends TestCase
{
    use RefreshHookDatabase;
    use UsesTemporaryPlaces;

    private string $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->project = $this->placeInTemporaryFolder(Place::Project);
        $this->journal->enrollHost('Mac', [base_path()]);
    }

    public function test_off_the_call_passes_untouched_and_nothing_is_written(): void
    {
        $answer = $this->heartbeat(['live_processes' => []]);

        $this->assertSame([204, false], [$answer->getStatusCode(), File::isDirectory($this->drafts())]);
    }

    public function test_on_a_call_and_a_refused_one_are_kept_as_asked_and_answered_without_a_signature(): void
    {
        $this->journal->switchRecordingOn();
        $this->app->make(RecordingDrafts::class)->openRun(Scenario::read('claude-code/terminal-turn', '{"steps":[]}'));

        $this->heartbeat(['live_processes' => []]);
        $this->heartbeat(['live_processes' => [], 'mood' => 'sunny']);

        $draft = (string) (glob("{$this->drafts()}/host/*.jsonl") ?: [''])[0];
        $lines = array_map(
            fn (string $line) => json_decode($line, true),
            array_slice(file($draft, FILE_IGNORE_NEW_LINES) ?: [], 1),
        );
        $kept = array_map(fn (array $line) => [
            $line['type'],
            $line['call']['method'],
            $line['call']['path'],
            $line['call']['status'],
            array_keys($line['call']['headers']),
        ], $lines);

        $this->assertSame(
            [
                ['asked', 'POST', '/host/heartbeat', null, ['Content-Type', 'Accept']],
                ['answered', 'POST', '/host/heartbeat', 204, []],
                ['asked', 'POST', '/host/heartbeat', null, ['Content-Type', 'Accept']],
                ['answered', 'POST', '/host/heartbeat', 422, ['Content-Type']],
            ],
            $kept,
        );
    }

    public function test_an_agents_own_call_is_kept_on_the_agent_wire_with_its_answer_and_not_while_off(): void
    {
        $start = $this->journal->owner()->signedStart('Main');
        $target = route('agents.agent.heartbeat', absolute: false);
        $this->journal->agentCall($start, 'POST', $target, ['request_key' => 'heartbeat-off']);
        $isKeptOff = File::isDirectory("{$this->drafts()}/agent");
        $this->journal->switchRecordingOn();
        $this->app->make(RecordingDrafts::class)->openRun(Scenario::read('claude-code/terminal-turn', '{"steps":[]}'));

        $this->journal->agentCall($start, 'POST', $target, ['request_key' => 'heartbeat-on']);

        $draft = (string) (glob("{$this->drafts()}/agent/*.jsonl") ?: [''])[0];
        $types = array_map(
            fn (string $line) => [json_decode($line, true)['type'], json_decode($line, true)['call']['path']],
            array_slice(file($draft, FILE_IGNORE_NEW_LINES) ?: [], 1),
        );

        $this->assertSame([false, [['asked', $target], ['answered', $target]]], [$isKeptOff, $types]);
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function heartbeat(array $body): TestResponse
    {
        $target = route('agents.host.heartbeat', absolute: false);

        return $this->journal->hostCall($this->journal->hostCalled('Mac'), 'POST', $target, $body);
    }

    private function drafts(): string
    {
        return "{$this->project}/".RecordingDrafts::DRAFTS;
    }
}
