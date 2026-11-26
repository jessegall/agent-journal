<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\Listener;
use App\Hosts\Commands\RemoveHostProcess\RemoveHostProcessCommand;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Hosts\HostProcess;

/**
 * A process of a contained host that ends has its container removed, so no ended container stays on the agent
 * daemon; the isolation probes are removed once they are judged.
 */
#[InCommandTransaction]
final readonly class RemoveEndedContainers implements Listener
{
    private const array JUDGED_PROBES = [HostProcessPurpose::RelayProbe, HostProcessPurpose::SandboxProbe];

    public function __construct(private CommandBus $commands) {}

    public function handle(HostProcessEndEvent $fact): void
    {
        $process = HostProcess::query()->with('host')->whereKey($fact->processId)->sole();

        if (! $process->host->arrangement->isContained() || in_array($process->purpose, self::JUDGED_PROBES, true)) {
            return;
        }

        $this->commands->run(new RemoveHostProcessCommand($process->id));
    }
}
