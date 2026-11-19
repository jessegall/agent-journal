<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use RuntimeException;

/**
 * A launch whose profile requires a skill the selection does not hold; the launch is refused until the profile or the
 * skill's targeting changes.
 */
final class SkillSelectionConflict extends RuntimeException implements CodedRefusal
{
    public static function requiredNotSelected(string $key, string $reason): self
    {
        return new self(
            "The profile requires the skill {$key}, but it is not selected for this launch ({$reason}); change the "
                ."profile's required skills or the skill's condition.",
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
