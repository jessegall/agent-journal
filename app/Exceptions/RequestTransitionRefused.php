<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Enums\CommandRules\RequestStatus;
use RuntimeException;

/**
 * A command request was asked to move to a state its current state does not lead to; the message names what is owed.
 */
final class RequestTransitionRefused extends RuntimeException
{
    public static function from(RequestStatus $status, RequestStatus $next, string $owed): self
    {
        return new self("A request that is {$status->value} cannot become {$next->value}: {$owed}");
    }

    public static function notTheRequester(): self
    {
        return new self('Only the actor who opened the request, or a user, may withdraw it.');
    }
}
