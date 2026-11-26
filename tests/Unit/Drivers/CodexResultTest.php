<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\Codex\CodexResult;
use App\Enums\Drivers\RequestProgress;
use App\Values\ThreadTokens;
use Carbon\CarbonImmutable;
use PHPUnit\Framework\TestCase;

/**
 * A recorded Codex exec turn, read chunk by chunk as the host sends it, gives its thread, the tokens it used and a
 * completed end; a turn that printed no events goes by its exit, and a failed turn fails.
 */
final class CodexResultTest extends TestCase
{
    private const string RECORDINGS = __DIR__.'/../../../resources/recordings/codex/0.165.0';

    public function test_each_recorded_exec_turn_gives_its_thread_tokens_and_completed_end(): void
    {
        $recorded = [
            'turns/process-turn' => ['01a1eea7-3f30-73b0-909d-32c186306641', 29462],
            'delegation-attempt-one-thread' => ['01a1ee99-b70f-7782-b4c6-12576eba3910', 29683],
        ];

        foreach ($recorded as $name => [$thread, $tokens]) {
            $result = new CodexResult('process-1');
            $usage = [];

            foreach ($this->stdoutOf($name) as $bytes) {
                $usage = [...$usage, ...$result->read($bytes, CarbonImmutable::parse('2026-11-26 10:00:00'))];
            }

            $this->assertSame(
                [$thread, [$tokens], [$thread], RequestProgress::Applied],
                [
                    $result->conversation(),
                    array_map(fn (ThreadTokens $reading) => $reading->total, $usage),
                    array_map(fn (ThreadTokens $reading) => $reading->threadId, $usage),
                    $result->end(0)->progress(),
                ],
                $name,
            );
        }
    }

    public function test_a_turn_that_printed_no_events_goes_by_its_exit_and_a_failed_turn_fails(): void
    {
        $plain = new CodexResult('process-2');

        foreach ($this->stdoutOf('one-turn-exec') as $bytes) {
            $plain->read($bytes, CarbonImmutable::now());
        }

        $failed = new CodexResult('process-3');
        $failed->read("{\"type\":\"thread.started\",\"thread_id\":\"t-1\"}\n{\"type\":\"turn.failed\"}\n", CarbonImmutable::now());

        $this->assertSame(
            [RequestProgress::Applied, RequestProgress::DeliveryUncertain, null, RequestProgress::Failed, 't-1'],
            [
                $plain->end(0)->progress(),
                $plain->end(null)->progress(),
                $plain->conversation(),
                $failed->end(0)->progress(),
                $failed->conversation(),
            ],
        );
    }

    /**
     * @return list<string>
     */
    private function stdoutOf(string $name): array
    {
        $fixture = json_decode((string) file_get_contents(self::RECORDINGS."/{$name}/fixture.json"), true, flags: JSON_THROW_ON_ERROR);
        $stdout = array_filter($fixture['output'], fn (array $chunk) => $chunk['stream'] === 'stdout');

        return array_values(array_map(fn (array $chunk) => (string) base64_decode($chunk['bytes'], true), $stdout));
    }
}
