<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A chat request key used again with a different message: the first message stays as it was.
 */
final class MessageRequestConflict extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function forKey(string $requestKey): self
    {
        return new self("Request key {$requestKey} was already used for a different message.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
