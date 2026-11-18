<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use InvalidArgumentException;

/**
 * A condition that is not a valid tree; it is refused whole, before anything is evaluated.
 */
final class SkillConditionInvalid extends InvalidArgumentException implements CodedRefusal
{
    public static function field(string $field, string $problem): self
    {
        return new self("The condition field {$field} {$problem}.");
    }

    public static function tooDeep(int $most): self
    {
        return new self("The condition is nested deeper than {$most} levels.");
    }

    public static function tooManyNodes(int $most): self
    {
        return new self("The condition has more than {$most} nodes.");
    }

    public static function parametersTooLarge(int $most): self
    {
        return new self("The condition parameters take more than {$most} bytes.");
    }

    public static function notJson(string $reason): self
    {
        return new self("The condition is not valid JSON: {$reason}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
