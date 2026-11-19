<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use InvalidArgumentException;

final class SkillKeyInvalid extends InvalidArgumentException implements CodedRefusal
{
    public static function for(string $text): self
    {
        return new self(
            "A skill key is 1 to 64 lowercase letters and digits in words joined by single hyphens, such as journal-plans; \"{$text}\" is not.",
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
