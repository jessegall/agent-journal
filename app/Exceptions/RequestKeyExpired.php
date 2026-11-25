<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Bus\ReceiptRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A request key whose receipt is past its retention: the write it named is not run again and its answer is gone.
 */
final class RequestKeyExpired extends RuntimeException implements CodedRefusal, CommandRefusal, ReceiptRefusal
{
    use RendersRefusal;

    public static function for(string $key): self
    {
        return new self(
            sprintf(
                'The request_key %s is past its retention and is not used again; read the current state, and send a new key for a new write.',
                $key,
            ),
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RequestKeyExpired;
    }

    protected function status(): int
    {
        return Response::HTTP_CONFLICT;
    }
}
