<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\StartExecutor;
use App\Agents\Data\HostRefusalData;
use App\Agents\Data\HostStartReplyData;
use App\Agents\Data\HostStopReplyData;
use App\Agents\Exceptions\HostStartRefused;
use Carbon\CarbonImmutable;
use PhpOption\Option;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

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
        $line = $this->exchange(['start' => [
            'startId' => $start->startId,
            'runtimeId' => $start->runtimeId,
            'sessionId' => $start->sessionId,
            'driver' => $start->hostDriver(),
            'executionMode' => $start->executionMode->value,
            'policyReference' => $start->policyReference,
            'workspace' => $start->workspace,
            'accountReference' => $start->accountReference,
        ]]);
        $reply = HostStartReplyData::from(json_decode($line, true, flags: JSON_THROW_ON_ERROR));

        return new ExecutionReceipt(
            $start->startId,
            new ExecutionReference($reply->execution),
            $start->executionMode,
            CarbonImmutable::parse($reply->startedAt),
        );
    }

    public function stop(ExecutionReference $execution): ExitReceipt
    {
        $line = $this->exchange(['stop' => ['execution' => $execution->id]]);
        $reply = HostStopReplyData::from(json_decode($line, true, flags: JSON_THROW_ON_ERROR));

        return new ExitReceipt(
            $execution,
            Option::fromValue($reply->exitCode),
            CarbonImmutable::parse($reply->endedAt),
        );
    }

    /**
     * The host's reply line, refused when the host refuses.
     *
     * @param  array<string, array<string, string>>  $request
     *
     * @throws HostStartRefused
     */
    private function exchange(array $request): string
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

        try {
            $refusal = HostRefusalData::from(json_decode($line, true, flags: JSON_THROW_ON_ERROR));
        } catch (CannotCreateData|TypeError) {
            return $line;
        }

        throw HostStartRefused::because($refusal->refusal);
    }
}
