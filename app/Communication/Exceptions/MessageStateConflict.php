<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A message change made against a state the message no longer has.
 */
final class MessageStateConflict extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function staleVersion(string $messageId, int $expected): self
    {
        return new self("Message {$messageId} changed since version {$expected}; read it again.");
    }

    public static function closed(string $messageId): self
    {
        return new self("Message {$messageId} is already answered or dismissed.");
    }

    public static function notWaiting(string $messageId): self
    {
        return new self("Message {$messageId} does not wait for an answer.");
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
