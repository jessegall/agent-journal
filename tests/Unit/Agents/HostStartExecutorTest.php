<?php

declare(strict_types=1);

namespace Tests\Unit\Agents;

use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\ExecutionModeType;
use App\Exceptions\HostStartRefused;
use App\Support\ExecutionReference;
use App\Support\HostStartExecutor;
use App\Support\PreparedStart;
use Symfony\Component\Process\Process;
use Tests\Fixtures\Agents\TestSelections;
use Tests\TestCase;

/**
 * The host-local executor sends one line to the protected host's socket and reads its one reply: a running
 * execution, an ended one with its exit code, or a refusal that starts nothing.
 */
final class HostStartExecutorTest extends TestCase
{
    private const string REFUSAL = 'no protected installation';

    private string $socket;

    private string $requestFile;

    protected function setUp(): void
    {
        parent::setUp();
        $folder = sys_get_temp_dir().'/host-start-'.bin2hex(random_bytes(4));
        mkdir($folder, 0o700);
        $this->socket = $folder.'/start.sock';
        $this->requestFile = $folder.'/request.json';
    }

    public function test_a_start_sends_the_prepared_start_and_answers_the_running_execution(): void
    {
        $host = $this->hostAnswering(['startId' => 'start-1', 'execution' => 'execution-9',
            'executionMode' => 'protected_host', 'startedAt' => '2026-11-20T01:00:00Z']);

        $receipt = new HostStartExecutor($this->socket, $this->app->make(DriverCatalogue::class))->start($this->prepared());
        $host->wait();

        $this->assertSame('execution-9', $receipt->execution->id);
        $this->assertSame('2026-11-20T01:00:00+00:00', $receipt->startedAt->toIso8601String());
        $sent = json_decode((string) file_get_contents($this->requestFile), true);
        $this->assertSame('claude', $sent['start']['driver']);
        $this->assertSame('runtime-1', $sent['start']['runtimeId']);
        $this->assertSame('protected_host', $sent['start']['executionMode']);
    }

    public function test_a_stop_answers_the_exit_code_the_host_proved(): void
    {
        $host = $this->hostAnswering(['execution' => 'execution-9', 'exitCode' => 3,
            'endedAt' => '2026-11-20T01:05:00Z']);

        $receipt = new HostStartExecutor($this->socket, $this->app->make(DriverCatalogue::class))->stop(new ExecutionReference('execution-9'));
        $host->wait();

        $this->assertSame(3, $receipt->exitCode->get());
    }

    public function test_a_refusal_from_the_host_is_thrown(): void
    {
        $host = $this->hostAnswering(['startId' => 'start-1', 'refusal' => self::REFUSAL]);

        try {
            new HostStartExecutor($this->socket, $this->app->make(DriverCatalogue::class))->start($this->prepared());
            $this->fail('A refused start returned a receipt.');
        } catch (HostStartRefused $refused) {
            $this->assertStringContainsString(self::REFUSAL, $refused->getMessage());
        } finally {
            $host->wait();
        }
    }

    public function test_a_host_that_is_not_listening_is_unreachable(): void
    {
        $this->expectException(HostStartRefused::class);

        new HostStartExecutor($this->socket, $this->app->make(DriverCatalogue::class))->start($this->prepared());
    }

    /**
     * A one-connection host on the socket: it saves the request line and writes the reply.
     *
     * @param  array<string, mixed>  $reply
     */
    private function hostAnswering(array $reply): Process
    {
        $script = <<<'PHP'
            [$socket, $requestFile, $reply] = array_slice($argv, 1);
            $server = stream_socket_server('unix://'.$socket);
            $connection = stream_socket_accept($server, 10);
            file_put_contents($requestFile, fgets($connection));
            fwrite($connection, $reply."\n");
            fclose($connection);
            PHP;
        $host = new Process([PHP_BINARY, '-r', $script, $this->socket, $this->requestFile, json_encode($reply)]);
        $host->start();
        $deadline = microtime(true) + 5;

        while (! file_exists($this->socket) && microtime(true) < $deadline) {
            usleep(10_000);
        }

        return $host;
    }

    private function prepared(): PreparedStart
    {
        return new PreparedStart(
            'start-1',
            'runtime-1',
            'session-1',
            TestSelections::of(),
            ExecutionModeType::ProtectedHost,
            'policy-1',
            '/workspaces/helper-7',
            'account-1',
        );
    }
}
