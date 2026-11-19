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
        return new self(
            sprintf('%s declares Authorize but names no subject: it must implement HasAuthorizationSubject.', $command),
        );
    }

    public static function policyInvalid(string $command, string $policy): self
    {
        return new self(
            sprintf(
                '%s is authorized by %s, which is no Policy with a public authorize(Actor, subject, ability).',
                $command,
                $policy,
            ),
        );
    }

    public static function subjectMismatched(string $command, string $subject, string $expected): self
    {
        return new self(
            sprintf(
                "%s names a subject of type %s, which its policy's authorize does not take (%s).",
                $command,
                $subject,
                $expected,
            ),
        );
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
        return new self(
            sprintf(
                '%s handles %s, which declares Authorize, so handle takes exactly (%s, %s).',
                $handler,
                $command,
                $command,
                $subject,
            ),
        );
    }
}
