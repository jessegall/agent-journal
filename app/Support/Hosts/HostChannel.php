<?php

declare(strict_types=1);

namespace App\Support\Hosts;

use App\Commands\Hosts\ResizeHostProcess\ResizeHostProcessCommand;
use App\Commands\Hosts\SendHostKeys\SendHostKeysCommand;
use App\Commands\Hosts\SignalHostProcess\SignalHostProcessCommand;
use App\Commands\Hosts\SnapshotHostProcess\SnapshotHostProcessCommand;
use App\Commands\Hosts\StopHostProcess\StopHostProcessCommand;
use App\Commands\Hosts\StreamHostProcess\StreamHostProcessCommand;
use App\Commands\Hosts\WriteHostInput\WriteHostInputCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Hosts\HostChannel as HostChannelContract;
use App\Values\HostOrderSource;
use App\Values\RowGuard;

/**
 * The host channel of protocol 1: every call runs the command that makes its order.
 */
final readonly class HostChannel implements HostChannelContract
{
    public function __construct(private CommandBus $commands) {}

    public function keys(
        string $processId,
        string $bytes,
        RowGuard $rows,
        int $inputGeneration,
        HostOrderSource $source,
    ): string {
        return $this->commands->run(new SendHostKeysCommand($processId, $bytes, $rows, $inputGeneration, $source));
    }

    public function write(string $processId, string $bytes, HostOrderSource $source): string
    {
        return $this->commands->run(new WriteHostInputCommand($processId, $bytes, $source));
    }

    public function resize(string $processId, int $columns, int $rows, HostOrderSource $source): string
    {
        return $this->commands->run(new ResizeHostProcessCommand($processId, $columns, $rows, $source));
    }

    public function signal(string $processId, string $signal, HostOrderSource $source): string
    {
        return $this->commands->run(new SignalHostProcessCommand($processId, $signal, $source));
    }

    public function stop(string $processId, int $graceMs, int $forceMs, HostOrderSource $source): string
    {
        return $this->commands->run(new StopHostProcessCommand($processId, $graceMs, $forceMs, $source));
    }

    public function stream(string $processId, int $framesPerSecond, bool $isRaw, HostOrderSource $source): string
    {
        return $this->commands->run(new StreamHostProcessCommand($processId, $framesPerSecond, $isRaw, $source));
    }

    public function snapshot(string $processId, HostOrderSource $source): string
    {
        return $this->commands->run(new SnapshotHostProcessCommand($processId, $source));
    }
}
