<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use Symfony\Component\Process\InputStream;
use Symfony\Component\Process\Process;
use Tests\Support\Agents\HostContract;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * php artisan mcp:relay as a started driver runs it: a child process on stdio, posting each frame as one signed call
 * to a stand-in journal (tests/Fixtures/Mcp/relay-server.php) and writing each answer back as one line.
 */
#[TimeLimit(
    seconds: 15,
    reason: 'It starts the relay and a stand-in journal as child processes, and one stand-in call waits two seconds.',
)]
final class RelayTest extends TestCase
{
    private const float WAIT_SECONDS = 15.0;

    /**
     * The headers of a call the Go relay (tools/journal-agent/cmd/journal-mcp) must send alike, and those of them whose
     * value differs on every call.
     */
    private const array COMPARED_HEADERS = ['authorization', 'content-type', 'mcp-', 'x-journal-'];

    private const array VARYING_HEADERS = ['x-journal-call-id', 'x-journal-call-issued-at', 'x-journal-call-signature'];

    private int $port;

    private string $serverLog;

    private Process|null $server = null;

    protected function setUp(): void
    {
        parent::setUp();

        $this->port = random_int(20000, 40000);
        $this->serverLog = (string) tempnam(sys_get_temp_dir(), 'relay-server');
    }

    protected function tearDown(): void
    {
        $this->server?->stop();
        @unlink($this->serverLog);

        parent::tearDown();
    }

    public function test_initialize_list_and_call_each_get_their_answer_and_a_notification_prints_nothing(): void
    {
        $this->startServer();

        $lines = $this->relay([
            '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"test","version":"1"}}}',
            '{"jsonrpc":"2.0","method":"notifications/initialized"}',
            '{"jsonrpc":"2.0","id":2,"method":"tools/list"}',
            '{"jsonrpc":"2.0","id":"call-3","method":"tools/call","params":{"name":"overview_read","arguments":{}}}',
        ]);

        $this->assertSame([1, 2, 'call-3'], array_column($lines, 'id'));
        $this->assertSame('journal', $lines[0]['result']['serverInfo']['name']);
        $this->assertTrue($lines[2]['result']['signed']);
        $this->assertSame('2025-11-25', $lines[1]['result']['protocol']);
        $this->assertCount(4, $this->serverCalls());
    }

    public function test_the_calls_it_sends_and_the_lines_it_prints_hold_to_the_contract_the_go_relay_shares(): void
    {
        $this->startServer();
        $frames = [
            '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"test","version":"1"}}}',
            '{"jsonrpc":"2.0","method":"notifications/initialized"}',
            '{"jsonrpc":"2.0","id":2,"method":"tools/list"}',
        ];

        $printed = $this->relay($frames);

        HostContract::of('relays/mcp-exchange.json')->assertHolds([
            'frames' => $frames,
            'calls' => $this->comparableCalls(),
            'printed' => $printed,
        ], []);
    }

    public function test_a_stopped_server_gives_one_unavailable_error_and_the_next_frame_works_once_it_answers(): void
    {
        $input = new InputStream();
        $relay = $this->startRelay($input);

        $input->write('{"jsonrpc":"2.0","id":1,"method":"ping"}'."\n");
        $first = $this->waitForLines($relay, 1);
        $this->startServer();
        $input->write('{"jsonrpc":"2.0","id":2,"method":"ping"}'."\n");
        $second = $this->waitForLines($relay, 2);
        $input->close();
        $relay->wait();

        $this->assertSame('unavailable', $first[0]['error']['data']['code']);
        $this->assertTrue($first[0]['error']['data']['retryable']);
        $this->assertSame(
            ['id' => 2, 'method' => 'ping'],
            ['id' => $second[1]['id'], 'method' => $second[1]['result']['method']],
        );
    }

    public function test_a_cancelled_queued_call_is_never_sent(): void
    {
        $this->startServer();

        $lines = $this->relay([
            '{"jsonrpc":"2.0","id":1,"method":"slow"}',
            '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"overview_read","arguments":{}}}',
            '{"jsonrpc":"2.0","method":"notifications/cancelled","params":{"requestId":2}}',
        ]);

        $this->assertSame([1], array_column($lines, 'id'));
        $this->assertSame(
            ['slow'],
            array_map(
                fn (array $call): mixed => json_decode((string) $call['body'], true)['method'],
                $this->serverCalls(),
            ),
        );
    }

    public function test_a_300_kib_frame_is_refused_before_signing(): void
    {
        $this->startServer();

        $lines = $this->relay(
            ['{"jsonrpc":"2.0","id":7,"method":"tools/call","params":{"filler":"'.str_repeat('a', 300 * 1024).'"}}'],
        );

        $this->assertSame(7, $lines[0]['id']);
        $this->assertSame('invalid_input', $lines[0]['error']['data']['code']);
        $this->assertSame([], $this->serverCalls());
    }

    /**
     * Runs the relay over the frames to the end of its input and returns its stdout lines, decoded.
     *
     * @param  list<string>  $frames
     * @return list<array<string, mixed>>
     */
    private function relay(array $frames): array
    {
        $relay = $this->relayProcess();
        $relay->setInput(implode("\n", $frames)."\n");
        $relay->mustRun();

        return $this->decoded($relay->getOutput());
    }

    private function startRelay(InputStream $input): Process
    {
        $relay = $this->relayProcess();
        $relay->setInput($input);
        $relay->start();

        return $relay;
    }

    private function relayProcess(): Process
    {
        return new Process([PHP_BINARY, base_path('artisan'), 'mcp:relay'], base_path(), [
            'JOURNAL_URL' => "http://127.0.0.1:{$this->port}",
            'JOURNAL_START_TOKEN' => 'test-start-token',
            'JOURNAL_PROFILE' => 'main-agent',
            'JOURNAL_PROFILE_REVISION' => '1',
        ], timeout: 60);
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function waitForLines(Process $relay, int $count): array
    {
        $deadline = microtime(true) + self::WAIT_SECONDS;

        while (count($lines = $this->decoded($relay->getOutput())) < $count && microtime(true) < $deadline) {
            usleep(50_000);
        }

        return $lines;
    }

    private function startServer(): void
    {
        $this->server = new Process(
            [PHP_BINARY, '-S', "127.0.0.1:{$this->port}", base_path('tests/Fixtures/Mcp/relay-server.php')],
            base_path(),
            ['RELAY_SERVER_LOG' => $this->serverLog],
        );
        $this->server->start();
        $deadline = microtime(true) + self::WAIT_SECONDS;

        while (@fsockopen('127.0.0.1', $this->port) === false && microtime(true) < $deadline) {
            usleep(50_000);
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function serverCalls(): array
    {
        return array_map(
            fn (string $line): array => json_decode($line, true),
            file($this->serverLog, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [],
        );
    }

    /**
     * Each call as both relays must send it: its path, its body and the compared headers, a varying value written as
     * the word varies; in the order of their methods, since the relays may send at once.
     *
     * @return list<array{path: string, body: mixed, headers: array<string, string>}>
     */
    private function comparableCalls(): array
    {
        $calls = array_map(fn (array $call): array => [
            'path' => $call['path'],
            'body' => json_decode($call['body'], flags: JSON_THROW_ON_ERROR),
            'headers' => $this->comparedHeaders($call['headers']),
        ], $this->serverCalls());
        usort($calls, fn (array $first, array $second) => strcmp($first['body']->method, $second['body']->method));

        return $calls;
    }

    /**
     * @param  array<string, string>  $headers
     * @return array<string, string>
     */
    private function comparedHeaders(array $headers): array
    {
        $compared = [];

        foreach ($headers as $name => $value) {
            if (array_any(self::COMPARED_HEADERS, fn (string $prefix) => str_starts_with($name, $prefix))) {
                $compared[$name] = in_array($name, self::VARYING_HEADERS, true) ? 'varies' : $value;
            }
        }

        ksort($compared);

        return $compared;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function decoded(string $output): array
    {
        return array_map(
            fn (string $line): array => json_decode($line, true, flags: JSON_THROW_ON_ERROR),
            array_values(array_filter(explode("\n", $output))),
        );
    }
}
