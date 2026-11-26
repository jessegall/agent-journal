<?php

declare(strict_types=1);

namespace Domain\Chat\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A chat entry asked for a record the chat cannot show: an alias the morph map does not know, or a record no actor made.
 */
final class ChatSourceRefused extends RuntimeException implements CommandRefusal
{
    public static function unknownType(string $sourceType): self
    {
        return new self("No record type is registered as {$sourceType}.");
    }

    public static function notAuthored(string $sourceType): self
    {
        return new self("A {$sourceType} record has no author, so the chat cannot show it.");
    }
}
