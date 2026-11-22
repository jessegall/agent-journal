<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

final class SkillKeyTaken extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function for(string $key): self
    {
        return new self("The skill key {$key} is taken; choose another user- key.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
