<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Support\ActorReference;
use App\Support\RecordIdentity;

/**
 * What a parent says a helper job is for: exactly one of a subject record, an existing purpose or a new purpose in
 * words, for one helper profile in the job's project.
 */
final readonly class PurposeChoice
{
    public function __construct(
        public string $projectId,
        public ActorReference $parent,
        public string $profileKey,
        public RecordIdentity|null $subject,
        public string|null $purposeId,
        public string|null $purposeText,
    ) {}

    public function formsGiven(): int
    {
        $forms = [$this->subject, $this->purposeId, $this->purposeText];

        return count(array_filter($forms, fn ($form) => $form !== null));
    }
}
