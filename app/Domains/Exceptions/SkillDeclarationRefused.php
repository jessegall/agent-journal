<?php

declare(strict_types=1);

namespace App\Domains\Exceptions;

final class SkillDeclarationRefused extends DomainDeclarationError
{
    public static function for(string $domainName, string $class, string $reason): self
    {
        return new self("{$domainName} declares the skill {$class}, but {$reason}.");
    }
}
