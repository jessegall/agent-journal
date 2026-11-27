<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings;

use App\Files\Enums\Place;
use App\Recordings\CallRecorders;
use App\Recordings\Enums\Wire;
use App\Recordings\RecordedCall;
use App\Recordings\RecordedEvent;
use App\Recordings\RecordingDrafts;
use App\Recordings\Scenarios\Scenario;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;
use Tests\Support\Files\UsesTemporaryPlaces;
use Tests\TestCase;

/**
 * A wire's call recorder writes nothing while recording is off; within a run it keeps each caller's calls, asked and
 * answered in order with their times, in that caller's own draft; and a new run starts from no drafts.
 */
final class CallRecorderTest extends TestCase
{
    use UsesTemporaryPlaces;

    private string $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->project = $this->placeInTemporaryFolder(Place::Project);
    }

    public function test_off_writes_nothing(): void
    {
        $this->recordCall('first', 10);

        $this->assertFalse(File::isDirectory("{$this->project}/".RecordingDrafts::DRAFTS));
    }

    public function test_on_keeps_each_callers_calls_asked_then_answered_in_their_own_draft(): void
    {
        $this->journal->switchRecordingOn();
        $this->app->make(RecordingDrafts::class)->openRun(Scenario::read('claude-code/terminal-turn', '{"steps":[]}'));

        $this->recordCall('first', 10);
        $this->recordCall('second', 20);
        $this->recordCall('first', 30);

        $drafts = glob("{$this->project}/".RecordingDrafts::DRAFTS.'/host/*.jsonl') ?: [];
        $kept = array_map(fn (string $draft) => array_map(
            fn (string $line) => [json_decode($line, true)['type'], json_decode($line, true)['at'] ?? null],
            array_slice(file($draft, FILE_IGNORE_NEW_LINES) ?: [], 1),
        ), $drafts);
        sort($kept);

        $this->assertSame(
            [
                [['asked', 20], ['answered', 21]],
                [['asked', 10], ['answered', 11], ['asked', 30], ['answered', 31]],
            ],
            $kept,
        );
    }

    public function test_a_new_run_removes_the_drafts_an_earlier_one_left(): void
    {
        $this->journal->switchRecordingOn();
        $drafts = $this->app->make(RecordingDrafts::class);
        $drafts->openRun(Scenario::read('claude-code/terminal-turn', '{"steps":[]}'));
        $this->recordCall('first', 10);

        $drafts->openRun(Scenario::read('codex/terminal-turn', '{"steps":[]}'));

        $this->assertSame([], glob("{$this->project}/".RecordingDrafts::DRAFTS.'/host/*.jsonl') ?: []);
    }

    /**
     * One host call of the caller, asked at the moment and answered a microsecond later.
     */
    private function recordCall(string $caller, int $at): void
    {
        $recorder = $this->app->make(CallRecorders::class)->of(Wire::Host);
        $request = Request::create('/host/heartbeat', 'POST', server: ['HTTP_AUTHORIZATION' => "Bearer {$caller}"]);
        $exchange = $recorder->exchangeOf($request);

        $recorder->add($exchange, RecordedEvent::asked($at, RecordedCall::askedBy($request)));
        $answer = RecordedCall::answeredWith(new Response(), $request);
        $recorder->add($exchange, RecordedEvent::answered($at + 1, $answer));
    }
}
