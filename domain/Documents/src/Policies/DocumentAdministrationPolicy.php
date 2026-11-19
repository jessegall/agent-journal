<?php

declare(strict_types=1);

namespace Domain\Documents\Policies;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * Who may recover drafts and change records another actor created: only the owner holds the ability, so the grants
 * decide.
 */
final readonly class DocumentAdministrationPolicy implements Policy
{
    /**
     * @param  object|class-string  $subject
     */
    public function authorize(Actor $actor, object|string $subject, BackedEnum $ability): void {}
}
