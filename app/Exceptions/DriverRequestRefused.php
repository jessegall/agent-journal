<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Values\StackTarget;
use RuntimeException;

/**
 * A driver request refused before it is accepted, so nothing of it is stored.
 */
final class DriverRequestRefused extends RuntimeException implements CommandRefusal
{
    public static function noRuntime(StackTarget $target): self
    {
        return new self("Agent {$target->agentId} has no runtime in session {$target->sessionId}.");
    }

    public static function changedSinceRead(string $requestId, int $expected, int $current): self
    {
        return new self("Request {$requestId} is at row version {$current}, not {$expected}; read it again.");
    }

    public static function notRetriable(string $requestId, string $progress): self
    {
        return new self(
            sprintf(
                'Request %s is %s; only a failed or unavailable request is retried, and an uncertain delivery is resolved first.',
                $requestId,
                $progress,
            ),
        );
    }

    public static function noEffectUnproven(string $requestId): self
    {
        return new self(
            "Request {$requestId} failed without proof that nothing ran; check its status, or send it again as a possible duplicate.",
        );
    }

    public static function notUncertain(string $requestId, string $progress): self
    {
        return new self("Request {$requestId} is {$progress}; only an uncertain delivery is sent again.");
    }

    public static function duplicateNotConfirmed(string $requestId): self
    {
        return new self(
            "Sending request {$requestId} again may deliver it twice; confirm the possible duplicate first.",
        );
    }

    public static function notCancellable(string $requestId, string $progress): self
    {
        return new self("Request {$requestId} is {$progress}; only a request that has not started is cancelled.");
    }

    public static function notResolvable(string $requestId): self
    {
        return new self(
            sprintf(
                'Request %s is no uncertain delivery; only an uncertain delivery, never a wake, is resolved.',
                $requestId,
            ),
        );
    }

    public static function notRepairable(string $requestId): self
    {
        return new self("Request {$requestId} is no failed setting change; only those are repaired in place.");
    }

    public static function noStoppedScript(string $requestId): self
    {
        return new self("Request {$requestId} is no key script stopped part way.");
    }

    public static function holdChanged(StackTarget $target, string $expected, string $current): self
    {
        return new self(
            sprintf(
                'The runtime of session %s is held for %s, not %s; read it again.',
                $target->sessionId,
                $current,
                $expected,
            ),
        );
    }

    public static function holdNotReleasable(StackTarget $target, string $hold): self
    {
        return new self(
            sprintf(
                "The runtime of session %s is held for %s, which ends only on the driver's own evidence.",
                $target->sessionId,
                $hold,
            ),
        );
    }

    public static function generationChanged(StackTarget $target, int $expected, int $current): self
    {
        return new self(
            sprintf(
                'The runtime of session %s is at process generation %s, not %s; read it again.',
                $target->sessionId,
                $current,
                $expected,
            ),
        );
    }

    public static function notReassignable(StackTarget $target): self
    {
        return new self(
            sprintf(
                'The runtime of session %s is not lost or waiting for attention; only such a runtime is moved to a new process.',
                $target->sessionId,
            ),
        );
    }

    public static function noParts(): self
    {
        return new self('A delivery holds at least one text or attachment.');
    }

    public static function attachmentMissing(string $attachmentId): self
    {
        return new self("Attachment {$attachmentId} is not there or has not finished uploading.");
    }

    public static function attachmentChanged(string $attachmentId): self
    {
        return new self("Attachment {$attachmentId} is not the version the message names.");
    }

    public static function messageTooLarge(int $bytes, int $limit): self
    {
        return new self("The message is {$bytes} bytes; a delivery carries at most {$limit}.");
    }

    public static function sessionEnded(StackTarget $target): self
    {
        return new self("Session {$target->sessionId} has ended; a new start opens a new session.");
    }

    public static function stopping(StackTarget $target): self
    {
        return new self("The runtime of session {$target->sessionId} is stopping and takes no more requests.");
    }

    public static function keyConflict(string $key): self
    {
        return new self("The request key {$key} was already used with other content.");
    }

    /**
     * @param  list<string>  $supported
     */
    public static function unsupportedEffort(string $effort, array $supported): self
    {
        return new self("The effort {$effort} is not supported; choose one of ".implode(', ', $supported).'.');
    }

    public static function emptyModel(): self
    {
        return new self('A model change needs a model name.');
    }
}
