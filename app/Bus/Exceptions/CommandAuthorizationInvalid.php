<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use LogicException;

/**
 * A command's Authorize declaration does not fit its subject, its policy or its handler; the application does not boot.
 */
final class CommandAuthorizationInvalid extends LogicException
{
    public static function subjectMissing(string $command): self
    {
        return new self("{$command} declares Authorize but names no subject: it must implement"
            .' HasAuthorizationSubject.');
    }

    public static function policyInvalid(string $command, string $policy): self
    {
        return new self("{$command} is authorized by {$policy}, which is no Policy with a"
            .' public authorize(Actor, subject, ability).');
    }

    public static function subjectMismatched(string $command, string $subject, string $expected): self
    {
        return new self("{$command} names a subject of type {$subject}, which its policy's"
            ." authorize does not take ({$expected}).");
    }

    public static function abilityMismatched(string $command, string $ability, string $expected): self
    {
        return new self("{$command} declares the ability {$ability}, which is no case of its policy's {$expected}.");
    }

    public static function classSubjectOnInstanceAbility(string $command, string $ability): self
    {
        return new self("{$command} names a model class as its subject, but {$ability} is no class-level ability.");
    }

    public static function handlerShape(string $command, string $handler, string $subject): self
    {
        return new self("{$handler} handles {$command}, which declares Authorize, so handle"
            ." takes exactly ({$command}, {$subject}).");
    }
}
