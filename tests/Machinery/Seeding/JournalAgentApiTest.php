<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Api\AgentRequestClient;
use App\Sessions\AgentClientSettings;
use Illuminate\Http\Client\Response;
use PHPUnit\Framework\AssertionFailedError;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Recordings\TestAgentApi;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * The test journal serves a recorded scenario's agent wire for the agent's own sender: a frame the recorded agent sent
 * meets the recorded journal's answer, and a frame the recording does not hold fails the test.
 */
#[TestsMachinery(TestJournal::class)]
final class JournalAgentApiTest extends TestCase
{
    public function test_a_recorded_frame_meets_the_recorded_answer(): void
    {
        $this->journal->agentApi(fn (TestAgentApi $journal) => $journal
            ->playing('claude-code/terminal-turn')
            ->assertAnswersFrame(1, $this->sendAsAgent(...)));
    }

    public function test_a_frame_the_recording_does_not_hold_fails_the_test(): void
    {
        $this->expectException(AssertionFailedError::class);
        $this->expectExceptionMessage('claude-code/terminal-turn');

        $this->journal->agentApi(fn (TestAgentApi $journal) => $journal
            ->playing('claude-code/terminal-turn')
            ->assertAnswersFrame(1, fn (AgentClientSettings $settings, string $path) => $this->sendAsAgent(
                $settings,
                $path,
                '{"jsonrpc":"2.0","id":99,"method":"never/recorded"}',
            )));
    }

    private function sendAsAgent(AgentClientSettings $settings, string $path, string $body): Response
    {
        return $this->app->make(AgentRequestClient::class)->post($settings, $path, $body);
    }
}
