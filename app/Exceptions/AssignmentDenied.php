<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use App\Support\ActorIdentity;
use RuntimeException;
use Throwable;

final class AssignmentDenied extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forCaller(ActorIdentity $caller, Throwable|null $previous = null): self
    {
        return new self(
            "Only the owner or a main agent may give out work; {$caller->type->value} {$caller->id} may not.",
            0,
            $previous,
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
