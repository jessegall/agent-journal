<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Support\ActorReference;
use RuntimeException;
use Throwable;

final class AssignmentDenied extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forCaller(ActorReference $caller, Throwable|null $previous = null): self
    {
        return new self(
            "Only the owner or a main agent may give out work; {$caller->type} {$caller->id} may not.",
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
