<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use App\Support\References\StateReference;
use App\Values\StackTarget;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A lift of work the stack holds no live frame for: the work was never started there, or it is already over.
 */
final class FrameNotHeld extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(StateReference $state, StackTarget $target): self
    {
        return new self(sprintf(
            'The stack of %s holds no live %s work to bring back on top; start the work first.',
            $target->description(),
            $state->typeKey,
        ));
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return Response::HTTP_CONFLICT;
    }
}
