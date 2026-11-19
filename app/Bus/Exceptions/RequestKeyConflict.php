<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use App\Bus\Contracts\AnswersFromReceipt;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A request key already used by this caller for a different write of the same command.
 */
final class RequestKeyConflict extends RuntimeException implements AnswersFromReceipt, CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $key): self
    {
        return new self(
            "The request_key {$key} was used for a different write; use a new key for a new write, or read it with "
                .'operations_read.',
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
