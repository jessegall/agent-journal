<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\StartExecutor;
use App\Agents\Exceptions\HostStartRefused;
use Carbon\CarbonImmutable;
use PhpOption\Option;

/**
 * Starts and stops prepared starts through the protected host on this machine: one JSON line to its local socket,
 * one reply line back. It spawns nothing itself; a reply means the program runs, or that it and its tools ended.
 */
final readonly class HostStartExecutor implements StartExecutor
{
    private const int REPLY_SECONDS = 60;

    public function __construct(private string $socket) {}

    public function start(PreparedStart $start): ExecutionReceipt
    {
        $reply = $this->exchange(['start' => [
            'startId' => $start->startId,
            'runtimeId' => $start->runtimeId,
            'sessionId' => $start->sessionId,
            'program' => $start->hostProgram(),
            'executionMode' => $start->executionMode->value,
            'policyReference' => $start->policyReference,
            'workspace' => $start->workspace,
            'accountReference' => $start->accountReference,
        ]]);

        return new ExecutionReceipt(
            $start->startId,
            new ExecutionReference((string) $reply['execution']),
            $start->executionMode,
            CarbonImmutable::parse((string) $reply['startedAt']),
        );
    }

    public function stop(ExecutionReference $execution): ExitReceipt
    {
        $reply = $this->exchange(['stop' => ['execution' => $execution->id]]);

        return new ExitReceipt(
            $execution,
            Option::fromValue($reply['exitCode']),
            CarbonImmutable::parse((string) $reply['endedAt']),
        );
    }

    /**
     * @param  array<string, array<string, string>>  $request
     * @return array<string, mixed>
     *
     * @throws HostStartRefused
     */
    private function exchange(array $request): array
    {
        $connection = @stream_socket_client('unix://'.$this->socket, timeout: self::REPLY_SECONDS);

        if ($connection === false) {
            throw HostStartRefused::unreachable($this->socket);
        }

        stream_set_timeout($connection, self::REPLY_SECONDS);
        fwrite($connection, json_encode($request, JSON_THROW_ON_ERROR)."\n");
        $line = fgets($connection);
        fclose($connection);

        if ($line === false) {
            throw HostStartRefused::unreachable($this->socket);
        }

        /**
         * @var array<string, mixed> $reply
         */
        $reply = json_decode($line, true, flags: JSON_THROW_ON_ERROR);

        if (isset($reply['refusal'])) {
            throw HostStartRefused::because((string) $reply['refusal']);
        }

        return $reply;
    }
}
