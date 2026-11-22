<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

final class ShippedSkillReadOnly extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function for(string $key): self
    {
        return new self(
            "The skill {$key} ships with the journal and cannot be edited; copy it to a user- key and edit the copy.",
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }
}
