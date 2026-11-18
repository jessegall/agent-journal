<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * What one activation appended: each profile it reached, in the order it was given.
 */
final readonly class ProfileActivation
{
    /**
     * @param  list<ActivatedProfile>  $profiles
     */
    public function __construct(
        public array $profiles,
    ) {}
}
