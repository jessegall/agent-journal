<?php

declare(strict_types=1);

namespace App\Assignments\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Who may change who holds a record: the grants of the acting actor decide, acquiring for oneself, dispatching to
 * another or letting go; whether the recipient may hold work is the assignee provider's own check.
 */
final readonly class AssignmentPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
