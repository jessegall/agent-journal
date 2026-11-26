<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Commands\NotifyStopped\NotifyStoppedCommand;
use App\Attributes\Listeners\InCommandTransaction;
use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\Listener;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;

/**
 * A host process that ends ends the start it runs for: one that never ran, as when the host refused to open it, refuses
 * the start with why; a terminal that ran stops it with proof, so its account holds are released. A headless turn that
 * ends leaves its start running, as the next turn runs for the same start.
 */
#[InCommandTransaction]
final readonly class EndStartWithItsProcess implements Listener
{
    public function __construct(private CommandBus $commands) {}

    public function handle(HostProcessEndEvent $fact): void
    {
        $process = HostProcess::query()->whereKey($fact->processId)->sole();

        if ($process->session_process_id === null) {
            return;
        }

        $start = SessionProcess::findLockedById($process->session_process_id);

        if ($process->started_at === null) {
            $start->refuse($fact->evidence);

            return;
        }

        if ($process->purpose === HostProcessPurpose::AgentTerminal) {
            $this->commands->run(new NotifyStoppedCommand($process->host_id, $start->start_key));
        }
    }
}
