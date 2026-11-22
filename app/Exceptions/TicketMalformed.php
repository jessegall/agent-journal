<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * An install ticket with a character outside base64url; the ticket itself is never repeated in the message.
 */
final class TicketMalformed extends RuntimeException
{
    public static function outsideBase64Url(): self
    {
        return new self('The install ticket holds a character outside base64url.');
    }
}
