<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use LogicException;
use Throwable;

/**
 * A command whose declaration does not fit its policy, its subject or its handler; it is refused at registration.
 */
final class CommandAuthorizationInvalid extends LogicException
{
    public static function grantUnsupported(string $command, Throwable $cause): self
    {
        return new self("{$command} declares a grant no registered policy accepts: {$cause->getMessage()}", 0, $cause);
    }

    public static function recordPolicyWithoutRecord(string $command, string $policy): self
    {
        return new self("{$command} declares the record policy {$policy}, so it must be a RecordCommand.");
    }

    public static function recordWithoutRecordPolicy(string $command, string $policy): self
    {
        return new self("{$command} is a RecordCommand, so its policy {$policy} must be a RecordPolicy.");
    }

    public static function subjectMismatched(string $command, string $subject, string $model): self
    {
        return new self("{$command}'s subject() returns {$subject}, but its policy guards {$model}.");
    }

    public static function permitsMissing(string $command, string $policy, string $model): self
    {
        return new self(sprintf(
            '%s uses %s, which needs a public permits(Actor, %s, AccessType): Response.',
            $command,
            $policy,
            $model,
        ));
    }

    public static function handlerShape(string $command, string $handler, string $expected): self
    {
        return new self("{$handler} handles {$command}, so its handle takes {$expected}.");
    }
}
