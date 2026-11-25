<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\CancelHelperJob;

use App\Commands\Agents\CancelSessionStart\CancelSessionStartCommand;
use App\Contracts\Bus\CommandBus;
use Domain\Helpers\Commands\Support\HelperCommandHandler;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\HelperStarts;

/**
 * Stops the job's live attempt through Core's CancelSessionStartCommand, then marks the job cancelled; the workspace stays.
 */
final readonly class CancelHelperJobHandler extends HelperCommandHandler
{
    public function __construct(
        private CommandBus $commands,
        private HelperStarts $starts,
    ) {}

    public function handle(CancelHelperJobCommand $command): string
    {
        $job = HelperJob::query()->open()->whereKey($command->jobId)->lockForUpdate()->firstOr(
            HelperUnavailable::throwing()->toYou(),
        );

        if ($job->status->isLive()) {
            $this->stopLiveAttempt($job, $command->idempotencyKey);
        }

        $job->cancel();

        return $job->id;
    }

    /**
     * Stops the session of the job's newest start; a start whose session never opened has nothing to stop.
     */
    private function stopLiveAttempt(HelperJob $job, string $idempotencyKey): void
    {
        $newest = array_slice($this->starts->of($job), 0, 1);

        foreach ($newest as $start) {
            if ($start->sessionId === null) {
                continue;
            }

            $this->commands->run(new CancelSessionStartCommand($start->agentId, $start->sessionId, $idempotencyKey));
        }
    }
}
