<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
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
