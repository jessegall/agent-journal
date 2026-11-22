<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Contracts\Sessions\StartRecordResolver;
use App\Support\OwnerStartRequest;
use App\Support\StartRecordDetails;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Models\HelperJob;

/**
 * The starts Core made for one helper job, newest first, and the commands a parent runs next with the model the job
 * last ran on; every value in a command is quoted for the shell.
 */
final readonly class HelperStarts
{
    public function __construct(private StartRecordResolver $starts) {}

    /**
     * @return list<StartRecordDetails>
     */
    public function of(HelperJob $job): array
    {
        return $this->starts->forOwnerReference(OwnerStartRequest::ownerReferenceOf($job->assignmentIdentity()));
    }

    public function hasRequest(HelperJob $job, string $requestId): bool
    {
        return array_any($this->of($job), fn (StartRecordDetails $start) => $start->requestId === $requestId);
    }

    public function continueCommand(HelperJob $job): string
    {
        return sprintf(
            'journal helper continue %s --job %s --model %s',
            escapeshellarg($job->helper_identity_id),
            escapeshellarg($job->id),
            escapeshellarg($this->lastModel($job)),
        );
    }

    public function sendCommand(HelperJob $job): string
    {
        return sprintf(
            'journal helper send %s --model %s --brief %s',
            escapeshellarg($job->helper_identity_id),
            escapeshellarg($this->lastModel($job)),
            escapeshellarg('<the new work>'),
        );
    }

    /**
     * The model of the job's newest start; every dispatched job has one.
     */
    private function lastModel(HelperJob $job): string
    {
        return (array_first($this->of($job)) ?? throw HelperUnavailable::toYou())->model;
    }
}
