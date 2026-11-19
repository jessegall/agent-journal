<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * Tasks added against a revision of the phase that is no longer its latest; nothing is added.
 */
final class PhaseRevisionChanged extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(int $number, int $expected, int $current): self
    {
        return new self(
            sprintf(
                'Phase %s is at revision %s, not %s; read it again with phases_read and change that revision.',
                $number,
                $current,
                $expected,
            ),
        );
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
