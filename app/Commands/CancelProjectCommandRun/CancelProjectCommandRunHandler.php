<?php

declare(strict_types=1);

namespace App\Commands\CancelProjectCommandRun;

use App\Contracts\CommandHandler;
use App\Models\ProjectCommandRun;

/**
 * Asks the running process of the agent's own run of this request id to stop and marks the cancellation asked for;
 * the run reads cancelled once its process exited.
 */
final readonly class CancelProjectCommandRunHandler implements CommandHandler
{
    public function handle(CancelProjectCommandRunCommand $command): void
    {
        foreach (ProjectCommandRun::lockByRequest($command->requestKey) as $run) {
            if ($run->agent_id !== $command->agentId || ! $run->isRunning()) {
                continue;
            }

            if ($run->pid !== null) {
                posix_kill($run->pid, SIGTERM);
            }

            $run->requestCancellation();
        }
    }
}
