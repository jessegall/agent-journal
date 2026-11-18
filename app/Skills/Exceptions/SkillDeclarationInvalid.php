<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use LogicException;

/**
 * A skill declared in code that cannot be built as declared; start-up stops on it.
 */
final class SkillDeclarationInvalid extends LogicException
{
    public static function notASkill(string $owner, string $class): self
    {
        return new self("{$owner} declares {$class} as a skill, but it is no class implementing App\\Skills\\Contracts\\Skill.");
    }

    public static function outsideOwner(string $owner, string $class): self
    {
        return new self("{$owner} declares the skill {$class}, which lies outside its own package.");
    }

    public static function reservedKey(string $owner, string $key): self
    {
        return new self("{$owner} declares the skill key {$key}, whose prefix it does not own.");
    }

    public static function noSections(string $key): self
    {
        return new self("The skill {$key} declares no sections.");
    }
}
