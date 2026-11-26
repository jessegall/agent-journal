<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use App\Values\ProfileKey;

final readonly class ProfileRevisionReference
{
    public function __construct(public ProfileKey $profile, public int $revision) {}
}
