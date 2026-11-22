<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

final class ProfileRevisionImmutable extends LogicException
{
    public static function for(string $revisionId): self
    {
        return new self(
            "Profile revision {$revisionId} is immutable: activate the profile again to append a new revision.",
        );
    }
}
