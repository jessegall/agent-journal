<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use RuntimeException;

/**
 * A Markdown part or asset a skill names that cannot be read as named: outside its owner's folder, missing, or with a
 * heading path that does not lead to exactly one section.
 */
final class SkillSourceInvalid extends RuntimeException
{
    public static function outsideFolder(string $file): self
    {
        return new self("The skill source {$file} is not a relative path inside its owner's resources/skills folder.");
    }

    public static function missingFile(string $file): self
    {
        return new self("The skill source {$file} does not exist in its owner's resources/skills folder.");
    }

    public static function unreadable(string $file, string $reason): self
    {
        return new self("The skill source {$file} cannot be read: {$reason}");
    }

    public static function missingHeading(string $selector): self
    {
        return new self("The skill source {$selector} names a heading path that is not there.");
    }

    public static function repeatedHeading(string $selector): self
    {
        return new self("The skill source {$selector} names a heading path that is there more than once.");
    }
}
