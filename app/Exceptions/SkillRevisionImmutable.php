<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

final class SkillRevisionImmutable extends LogicException
{
    public static function for(string $revisionId): self
    {
        return new self("Skill revision {$revisionId} is immutable: save a new revision instead.");
    }
}
