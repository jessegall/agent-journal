<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
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
