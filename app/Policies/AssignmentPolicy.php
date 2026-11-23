<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Authorization\Policy;
use App\Models\Records\AssignmentRecord;

/**
 * Who may change who holds a record: the grants of the acting actor decide, acquiring for oneself, dispatching to
 * another or letting go; whether the recipient may hold work is the assignee provider's own check.
 */
final readonly class AssignmentPolicy implements Policy
{
    public static function model(): string
    {
        return AssignmentRecord::class;
    }
}
