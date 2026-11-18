<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use RuntimeException;

/**
 * A prepared call whose deadline passed before it could be sent; it never reached the journal.
 */
final class CallDeadlinePassed extends RuntimeException implements CodedRefusal
{
    public static function for(string $callId): self
    {
        return new self("The deadline of call {$callId} passed before it was sent; send it again with the same request_key.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::DeadlineExpired;
    }
}
