<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\StaleRefusal;
use RuntimeException;

/**
 * A message change made against a state the message no longer has.
 */
final class MessageStateConflict extends RuntimeException implements CodedRefusal, StaleRefusal
{
    use RendersRefusal;

    private function __construct(string $message, private readonly string $staleCode)
    {
        parent::__construct($message);
    }

    public static function staleVersion(string $messageId, int $expected): self
    {
        return new self("Message {$messageId} changed since version {$expected}; read it again.", 'stale-version');
    }

    public static function closed(string $messageId): self
    {
        return new self("Message {$messageId} is already answered or dismissed.", 'message-closed');
    }

    public static function notWaiting(string $messageId): self
    {
        return new self("Message {$messageId} does not wait for an answer.", 'message-not-waiting');
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    public function staleCode(): string
    {
        return $this->staleCode;
    }
}
