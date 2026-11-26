<?php

declare(strict_types=1);

namespace Domain\Helpers\Support\States\Support;

use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;

final class HelperJobStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'helpers.job';
    }

    /**
     * The job as its helper starts on it: who the helper is, the purpose, the brief, the steering so far and the
     * records it was given.
     */
    public static function forJob(HelperJob $job, HelperIdentity $identity, string $purposeLabel): StateReference
    {
        return self::about(new SubjectReference($job->id, 1), [
            'jobId' => $job->id,
            'helperId' => $identity->id,
            'profileKey' => $identity->profile_key,
            'profileRevision' => $job->profile_revision,
            'purpose' => $purposeLabel,
            'brief' => $job->brief,
            'steering' => $job->steering,
            'sources' => $job->sourceSubjects(),
        ]);
    }
}
