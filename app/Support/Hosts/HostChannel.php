<?php

declare(strict_types=1);

namespace App\Support\Hosts;

use App\Commands\Hosts\CloseHostPrivateEntry\CloseHostPrivateEntryCommand;
use App\Commands\Hosts\ForwardUserKeys\ForwardUserKeysCommand;
use App\Commands\Hosts\OpenHostPrivateEntry\OpenHostPrivateEntryCommand;
use App\Commands\Hosts\ResizeHostProcess\ResizeHostProcessCommand;
use App\Commands\Hosts\SendHostKeys\SendHostKeysCommand;
use App\Commands\Hosts\SignalHostProcess\SignalHostProcessCommand;
use App\Commands\Hosts\StopHostProcess\StopHostProcessCommand;
use App\Commands\Hosts\StreamHostProcess\StreamHostProcessCommand;
use App\Commands\Hosts\TakeHostProcessSnapshot\TakeHostProcessSnapshotCommand;
use App\Commands\Hosts\WriteHostInput\WriteHostInputCommand;
use App\Commands\Hosts\WriteHostPrivateValue\WriteHostPrivateValueCommand;
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
