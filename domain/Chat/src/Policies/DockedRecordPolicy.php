<?php

declare(strict_types=1);

namespace Domain\Chat\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Every actor keeps its own docked records; whether it may read the record is checked on each change and each list.
 */
final readonly class DockedRecordPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
