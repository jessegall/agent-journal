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
 * A request key whose receipt is past its retention: the write it named is not run again and its answer is gone.
 */
final class RequestKeyExpired extends RuntimeException implements AnswersFromReceipt, CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $key): self
    {
        return new self("The request_key {$key} is past its retention and is not used again; read the current state, and send a new key for a new write.");
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
