<?php

declare(strict_types=1);

namespace Domain\Helpers\Handlers;

use Domain\Helpers\Commands\ContinueHelper;
use Domain\Helpers\Enums\JobState;
use Domain\Helpers\Exceptions\HelperJobAlreadyEnded;
use Domain\Helpers\Exceptions\HelperLaunchUncertain;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Handlers\Support\HelperCommandHandler;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Readers\HelperRecords;
use Domain\Helpers\Support\HelperDispatch;
use Domain\Helpers\Support\HelperReceipt;
use Domain\Helpers\Support\HelperStarts;

/**
 * Continues the parent's own unfinished job of the named helper: an ended job refuses with the send that gives the
 * helper new work, and a job whose attempt may still run or is held refuses as uncertain.
 */
final readonly class ContinueHelperHandler extends HelperCommandHandler
{
    public function __construct(
        private HelperDispatch $dispatch,
        private HelperRecords $records,
        private HelperStarts $starts,
    ) {}

    public function handle(ContinueHelper $command): HelperReceipt
    {
        $job = HelperJob::query()
            ->whereKey($command->jobId)
            ->where('helper_identity_id', $command->identityId)
            ->lockForUpdate()
            ->firstOr(fn () => throw HelperUnavailable::toYou());

        if ($this->starts->hasRequest($job, $command->requestId)) {
            return $this->records->receiptOf($job->id);
        }

        if ($job->isFinished()) {
            throw HelperJobAlreadyEnded::withSendCommand(
                $job->id,
                $job->state->value,
                $this->starts->sendCommand($job),
            );
        }

        if ($job->state !== JobState::Unfinished) {
            throw HelperLaunchUncertain::forIdentity($job->helper_identity_id);
        }

        return $this->dispatch->continueJob($job, $command->requestId, $command->model, $command->programKey);
    }
}
