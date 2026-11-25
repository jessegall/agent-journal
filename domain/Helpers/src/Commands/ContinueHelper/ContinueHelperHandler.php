<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\ContinueHelper;

use Domain\Helpers\Commands\Support\HelperCommandHandler;
use Domain\Helpers\Enums\JobState;
use Domain\Helpers\Exceptions\HelperJobAlreadyEnded;
use Domain\Helpers\Exceptions\HelperStartUncertain;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\HelperDispatch;
use Domain\Helpers\Support\HelperStarts;
use Domain\Helpers\Support\Readers\HelperRecords;
use Domain\Helpers\Values\HelperReceipt;

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

    public function handle(ContinueHelperCommand $command): HelperReceipt
    {
        $job = HelperJob::query()
            ->whereKey($command->jobId)
            ->ofHelperIdentity($command->identityId)
            ->lockForUpdate()
            ->firstOr(HelperUnavailable::throwing()->toYou());

        if ($this->starts->hasRequest($job, $command->requestId)) {
            return $this->records->receiptOf($job->id);
        }

        if ($job->isFinished()) {
            throw HelperJobAlreadyEnded::withSendCommand(
                $job->id,
                $job->state->value,
                $this->starts->sendCall($job),
            );
        }

        if ($job->state !== JobState::Unfinished) {
            throw HelperStartUncertain::forIdentity($job->helper_identity_id);
        }

        return $this->dispatch->continueJob($job, $command->requestId, $command->model, $command->driverKey);
    }
}
