<?php

declare(strict_types=1);

namespace Domain\Documents\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Who may administer document recovery: only the owner holds the ability, so the grants decide.
 */
final readonly class DocumentRecoveryPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
