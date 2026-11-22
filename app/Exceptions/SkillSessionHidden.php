<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A session whose skill delivery the actor may not see, answered as not found so its identity, target and skills stay
 * unnamed.
 */
final class SkillSessionHidden extends RuntimeException implements CodedRefusal
{
    public static function create(): self
    {
        return new self('No skill delivery was found for that session.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
