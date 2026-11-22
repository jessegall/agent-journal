<?php

declare(strict_types=1);

namespace App\Values;

final readonly class ProfileRevisionReference
{
    public function __construct(public ProfileKey $profile, public int $revision) {}
}
