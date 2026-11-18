<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use LogicException;

/**
 * A skill that cannot be rendered as declared: a reserved key, too few or too many sections, a section key twice, a
 * description out of bounds, text that is not UTF-8 or a result too large. Nothing of it is rendered.
 */
final class SkillDeclarationInvalid extends LogicException implements CodedRefusal
{
    public static function reservedKey(string $owner, string $key): self
    {
        return new self("{$owner} declares the skill key {$key}, whose prefix it does not own.");
    }

    public static function sectionCount(string $key, int $count, int $most): self
    {
        return new self("The skill {$key} has {$count} sections; a skill has 1 to {$most}.");
    }

    public static function sectionKeyTwice(string $key, string $sectionKey): self
    {
        return new self("The skill {$key} has the section key {$sectionKey} twice.");
    }

    public static function descriptionLength(string $key, int $most): self
    {
        return new self("The description of the skill {$key} must be 1 to {$most} bytes.");
    }

    public static function encoding(string $key): self
    {
        return new self("The skill {$key} holds text that is not valid UTF-8.");
    }

    public static function tooLarge(string $key, int $most): self
    {
        return new self("The skill {$key} renders to more than {$most} bytes.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
