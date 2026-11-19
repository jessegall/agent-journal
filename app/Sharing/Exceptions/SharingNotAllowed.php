<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Actors\Contracts\Actor;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * An actor other than the current configured owner tried to manage shares.
 */
final class SharingNotAllowed extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forActor(Actor $actor): self
    {
        return new self(
            "Only the journal's owner manages shares; {$actor->actorType()->value} {$actor->actorId()} may not.",
        );
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
