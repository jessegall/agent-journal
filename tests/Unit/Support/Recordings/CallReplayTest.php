<?php

declare(strict_types=1);

namespace Tests\Unit\Support\Recordings;

use App\Recordings\Enums\Wire;
use App\Recordings\RecordedCall;
use App\Recordings\Recordings;
use App\Recordings\ScenarioRecording;
use PHPUnit\Framework\AssertionFailedError;
use Tests\Support\Recordings\CallReplay;
use Tests\Support\Recordings\Exceptions\UnrecordedCall;
use Tests\TestCase;

/**
 * A real recording's calls play back in their order and whole, and an unrecorded call fails by name.
 */
final class CallReplayTest extends TestCase
{
    public function test_the_recorded_calls_play_in_order_and_whole(): void
    {
        $recording = $this->recording();
        $replay = new CallReplay($recording, Wire::Host);

        foreach ($this->answered($recording) as $call) {
            $this->assertSame($call->status, $replay->answer($call->method, $call->path)->status);
        }

        $replay->assertPlayedWhole();
    }

    public function test_an_unrecorded_call_fails_naming_it_and_the_next_one(): void
    {
        $first = $this->answered($this->recording())[0];

        $this->expectExceptionObject(UnrecordedCall::asked('GET /host/never-recorded', "{$first->method} {$first->path}"));

        new CallReplay($this->recording(), Wire::Host)->answer('GET', '/host/never-recorded');
    }

    public function test_a_call_never_asked_fails_the_play(): void
    {
        $this->expectException(AssertionFailedError::class);

        new CallReplay($this->recording(), Wire::Host)->assertPlayedWhole();
    }

    private function recording(): ScenarioRecording
    {
        return $this->app->make(Recordings::class)->scenario('host', 'folders');
    }

    /**
     * @return list<RecordedCall>
     */
    private function answered(ScenarioRecording $recording): array
    {
        return array_values(array_filter($recording->calls(Wire::Host), fn (RecordedCall $call) => $call->status !== null));
    }
}
