<?php

declare(strict_types=1);

namespace App\Profiles\Values;

final readonly class ExpectedDraftRevision
{
    public function __construct(public ProfileKey $profile, public int $revision) {}
}
