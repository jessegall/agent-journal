<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Actors\Actor;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
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
            "Only the journal's owner manages shares; {$actor->actorType()} {$actor->actorId()} may not.",
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
