<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use RuntimeException;

final class UserActorRequired extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function forActor(string $type): self
    {
        return new self("Only a user may do this; the actor of this request is an {$type}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }
}
