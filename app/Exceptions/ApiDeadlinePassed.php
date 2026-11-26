<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Api\Exceptions\ApiFailed;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use Throwable;

/**
 * A prepared call whose deadline passed before it could be sent; it never reached the journal.
 */
final class ApiDeadlinePassed extends ApiFailed implements CodedRefusal
{
    public static function for(string $callId, Throwable|null $previous = null): self
    {
        return new self(
            "The deadline of call {$callId} passed before it was sent; send it again with the same request_key.",
            previous: $previous
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::DeadlineExpired;
    }
}
