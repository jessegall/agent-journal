<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A message body past the most a message holds.
 */
final class MessageBodyTooLong extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forBytes(int $bytes): self
    {
        return new self("A message holds at most 65536 bytes; this one has {$bytes}.");
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
