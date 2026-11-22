<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Actors\Actor;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * An actor asked to read or change an auto-assignment it may not; the message names the asker, never the target.
 */
final class AutoAssignmentDenied extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forRead(Actor $actor): self
    {
        return new self("The {$actor->actorType()->value} {$actor->actorId()} may not read this auto-assignment.");
    }

    public static function forWrite(Actor $actor): self
    {
        return new self("The {$actor->actorType()->value} {$actor->actorId()} may not change this auto-assignment.");
    }

    protected function status(): int
    {
        return 403;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }
}
