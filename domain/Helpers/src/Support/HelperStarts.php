<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Contracts\Sessions\StartRecordResolver;
use App\Support\OwnerStartRequest;
use App\Support\StartRecordDetails;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Mcp\Tools\ContinueHelperTool;
use Domain\Helpers\Mcp\Tools\SendHelperTool;
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

    /**
     * The tool call that continues the job in its conversation, with every input it needs.
     */
    public function continueCall(HelperJob $job): string
    {
        return sprintf(
            "%s with identity_id '%s', job_id '%s' and model '%s'",
            ContinueHelperTool::NAME,
            $job->helper_identity_id,
            $job->id,
            $this->lastModel($job),
        );
    }

    /**
     * The tool call that gives the job's helper new work, with the inputs it is known by and a brief left to write.
     */
    public function sendCall(HelperJob $job): string
    {
        return self::sendCallFor($job->helper_identity_id, "model '{$this->lastModel($job)}' and a brief of the new work");
    }

    /**
     * The tool call that gives a helper new work, naming the helper and what else the call takes.
     */
    public static function sendCallFor(string $identityId, string $rest): string
    {
        return sprintf("%s with identity_id '%s', its profile_key, %s", SendHelperTool::NAME, $identityId, $rest);
    }

    /**
     * The model of the job's newest start; every dispatched job has one.
     */
    private function lastModel(HelperJob $job): string
    {
        return (array_first($this->of($job)) ?? throw HelperUnavailable::toYou())->model;
    }
}
