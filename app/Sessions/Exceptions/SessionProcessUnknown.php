<?php

declare(strict_types=1);

namespace App\Sessions\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * The reporting host claimed no process start with this key.
 */
final class SessionProcessUnknown extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /**
     * @use ThrowsLater<SessionProcessUnknown>
     */
    use ThrowsLater;

    public static function for(string $startKey): self
    {
        return new self("This host claimed no process start {$startKey}.");
    }

    public static function forSession(string $sessionId): self
    {
        return new self("Session {$sessionId} has no current start.");
    }

    protected function status(): int
    {
        return 404;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
