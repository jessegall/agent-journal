<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Contracts\Records\RecordVisibility;
use Domain\Helpers\Exceptions\PurposeConflict;
use Domain\Helpers\Exceptions\PurposeRequired;
use Domain\Helpers\Exceptions\SubjectUnavailable;
use Domain\Helpers\Models\HelperPurpose;

/**
 * Finds what a helper job is for, inside the starting command's own transaction: one purpose per parent, profile and
 * record, an existing purpose of the same parent and profile, or a new purpose for words, which never merges.
 */
final readonly class PurposeResolver
{
    public function __construct(private RecordVisibility $visibility) {}

    public function resolve(PurposeChoice $choice): HelperPurpose
    {
        if ($choice->formsGiven() === 0) {
            throw PurposeRequired::forJob();
        }

        if ($choice->formsGiven() > 1) {
            throw PurposeConflict::forJob();
        }

        if ($choice->subject !== null) {
            if (! $this->visibility->isVisible($choice->subject)) {
                throw SubjectUnavailable::forJob();
            }

            return HelperPurpose::forSubjectOnce($choice->parent, $choice->profileKey, $choice->subject);
        }

        if ($choice->purposeId !== null) {
            return HelperPurpose::ofParent($choice->parent, $choice->profileKey, $choice->purposeId)
                ?? throw SubjectUnavailable::forJob();
        }

        return HelperPurpose::free($choice->parent, $choice->profileKey, (string) $choice->purposeText);
    }
}
