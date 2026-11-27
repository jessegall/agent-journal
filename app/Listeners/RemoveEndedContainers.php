<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Listeners\InCommandTransaction;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Hosts\Commands\RemoveHostProcess\RemoveHostProcessCommand;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Models\Hosts\HostProcess;

/**
 * A process of a contained host that ends has its container removed, so no ended container stays on the agent
 * daemon; the isolation probes are removed once they are judged.
 */
#[InCommandTransaction]
final readonly class RemoveEndedContainers implements Listener
{
    private const string TRUSTED_ENTRY = 'removing what an ended session left';

    public function __construct(private JournalCommands $commands) {}

    public function handle(HostProcessEndEvent $fact): void
    {
        $process = HostProcess::query()->withHost()->whereKey($fact->processId)->sole();

        if (! $process->host->arrangement->isContained()) {
            return;
        }

        $this->commands->runAsJournal(
            CommandEntry::HostControl,
            self::TRUSTED_ENTRY,
            new RemoveHostProcessCommand($process->id),
        );
    }
}
