<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * What one activation appended: each profile it reached, in the order it was given, and the hash of the configuration
 * every revision it appended carries.
 */
final readonly class ProfileActivation
{
    /**
     * @param  list<ActivatedProfile>  $profiles
     */
    public function __construct(
        public array $profiles,
        public string $configurationHash,
    ) {}
}
