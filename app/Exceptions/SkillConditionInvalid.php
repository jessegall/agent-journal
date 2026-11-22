<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CodedRefusal;
use App\Enums\RefusalCode;
use InvalidArgumentException;
use Throwable;

/**
 * A condition that is not a valid tree; it is refused whole, before anything is evaluated.
 */
final class SkillConditionInvalid extends InvalidArgumentException implements CodedRefusal
{
    public static function field(string $field, string $problem, Throwable|null $previous = null): self
    {
        return new self("The condition field {$field} {$problem}.", previous: $previous);
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

    public static function notJson(Throwable $cause): self
    {
        return new self("The condition is not valid JSON: {$cause->getMessage()}.", previous: $cause);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
