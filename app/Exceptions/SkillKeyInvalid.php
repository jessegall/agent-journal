<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use InvalidArgumentException;

final class SkillKeyInvalid extends InvalidArgumentException implements CodedRefusal
{
    public static function for(string $text): self
    {
        return new self(
            sprintf(
                'A skill key is 1 to 64 lowercase letters and digits in words joined by single hyphens, such as journal-plans; "%s" is not.',
                $text,
            ),
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
