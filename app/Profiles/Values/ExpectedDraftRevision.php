<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Values\ProfileKey;

final readonly class ExpectedDraftRevision
{
    public function __construct(public ProfileKey $profile, public int $revision) {}
}
