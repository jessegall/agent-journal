<?php

declare(strict_types=1);

namespace App\Messages\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * An actor that cannot send or read messages tried to.
 */
final class MessageParticipantRefused extends RuntimeException implements CommandRefusal
{
    public static function cannotSend(string $actorType): self
    {
        return new self("A {$actorType} actor sends no messages.");
    }

    public static function cannotRead(string $actorType): self
    {
        return new self("A {$actorType} actor reads no messages.");
    }
}
