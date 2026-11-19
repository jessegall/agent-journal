<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use RuntimeException;

/**
 * A Markdown part or asset a skill names that cannot be read as named: outside its owner's folder, missing, or with a
 * heading path that does not lead to exactly one section, or a file whose # title and ## headings do not make sections.
 */
final class SkillSourceInvalid extends RuntimeException implements CodedRefusal
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

    public static function missingTitle(string $file): self
    {
        return new self("The skill source {$file} has no # title before its first ## heading.");
    }

    public static function secondTitle(string $file, string $heading): self
    {
        return new self("The skill source {$file} has a second # title, {$heading}.");
    }

    public static function titleDiffers(string $file, string $title, string $name): self
    {
        return new self("The skill source {$file} has the # title {$title}, but the skill is named {$name}.");
    }

    public static function headingWithoutKey(string $file, string $heading): self
    {
        return new self("The skill source {$file} has the ## heading {$heading}, which gives no section key.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
