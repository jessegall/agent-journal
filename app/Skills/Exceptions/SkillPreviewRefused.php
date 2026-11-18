<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use RuntimeException;

/**
 * A skill command run from the command line with no journal owner to act as.
 */
final class SkillPreviewRefused extends RuntimeException
{
    public static function noOwner(): self
    {
        return new self('No owner is configured for this journal; set the owner before using the skill commands from the command line.');
    }
}
