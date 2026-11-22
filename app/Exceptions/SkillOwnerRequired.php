<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

final class SkillOwnerRequired extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function toRetire(string $key): self
    {
        return new self("Only the owner of the skill {$key} may retire it.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }
}
