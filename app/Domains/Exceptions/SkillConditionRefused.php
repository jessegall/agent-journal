<?php

declare(strict_types=1);

namespace App\Domains\Exceptions;

final class SkillConditionRefused extends DomainDeclarationError
{
    public static function for(string $domainName, string $key, string $reason): self
    {
        return new self("{$domainName} registers the skill condition {$key}, but {$reason}.");
    }
}
