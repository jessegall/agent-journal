<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Bus\Contracts\CommandBus;
use App\Hosts\Commands\CloseHostPrivateEntry\CloseHostPrivateEntryCommand;
use App\Hosts\Commands\ForwardUserKeys\ForwardUserKeysCommand;
use App\Hosts\Commands\OpenHostPrivateEntry\OpenHostPrivateEntryCommand;
use App\Hosts\Commands\ResizeHostProcess\ResizeHostProcessCommand;
use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Commands\SignalHostProcess\SignalHostProcessCommand;
use App\Hosts\Commands\StopHostProcess\StopHostProcessCommand;
use App\Hosts\Commands\StreamHostProcess\StreamHostProcessCommand;
use App\Hosts\Commands\TakeHostProcessSnapshot\TakeHostProcessSnapshotCommand;
use App\Hosts\Commands\WriteHostInput\WriteHostInputCommand;
use App\Hosts\Commands\WriteHostPrivateValue\WriteHostPrivateValueCommand;
use App\Hosts\Contracts\HostChannel as HostChannelContract;
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
        return $this->commands->run(new TakeHostProcessSnapshotCommand($processId, $source));
    }

    public function userKeys(string $processId, string $bytes, HostOrderSource $source): string
    {
        return $this->commands->run(new ForwardUserKeysCommand($processId, $bytes, $source));
    }

    public function openPrivate(string $processId, HostOrderSource $source): string
    {
        return $this->commands->run(new OpenHostPrivateEntryCommand($processId, $source));
    }

    public function writePrivate(string $processId, string $submissionId, HostOrderSource $source): string
    {
        return $this->commands->run(new WriteHostPrivateValueCommand($processId, $submissionId, $source));
    }

    public function closePrivate(string $processId, HostOrderSource $source): string
    {
        return $this->commands->run(new CloseHostPrivateEntryCommand($processId, $source));
    }
}
