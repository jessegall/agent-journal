<?php

declare(strict_types=1);

namespace App\Enums\Assignments;

/**
 * What assignments of a record type are for: public work anyone with authority may hand out, or an internal
 * responsibility, such as a desk seat, that only Core's own writers change.
 */
enum AssignmentPurpose: string
{
    case PublicWork = 'public-work';
    case InternalResponsibility = 'internal-responsibility';
    case JournalAssigned = 'journal-assigned';

    public function isPublic(): bool
    {
        return $this === self::PublicWork;
    }

    public function isResponsibility(): bool
    {
        return $this === self::InternalResponsibility;
    }
}
