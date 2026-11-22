<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Contracts\ReceiptRefusal;
use App\Enums\RefusalCode;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A request key already used by this caller for a different write of the same command.
 */
final class RequestKeyConflict extends RuntimeException implements CodedRefusal, CommandRefusal, ReceiptRefusal
{
    use RendersRefusal;

    public static function for(string $key): self
    {
        return new self(
            sprintf(
                'The request_key %s was used for a different write; use a new key for a new write, or read it with operations_read.',
                $key,
            ),
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RequestKeyConflict;
    }

    protected function status(): int
    {
        return Response::HTTP_CONFLICT;
    }
}
