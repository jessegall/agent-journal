<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use RuntimeException;

/**
 * A preview from the command line that has no owner to act as.
 */
final class SkillPreviewRefused extends RuntimeException
{
    public static function noOwner(): self
    {
        return new self('No owner is configured for this journal; set the owner before previewing skills from the command line.');
    }
}
