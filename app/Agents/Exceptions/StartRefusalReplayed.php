<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Contracts\ReceiptRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A start request sent again after it was refused: the refusal its record kept is given again, and nothing runs.
 */
final class StartRefusalReplayed extends RuntimeException implements CodedRefusal, CommandRefusal, ReceiptRefusal
{
    use RendersRefusal;

    private function __construct(string $message, public readonly string $reason)
    {
        parent::__construct($message);
    }

    public static function forRequest(string $requestId, string $reason): self
    {
        return new self(
            "Start request {$requestId} was already refused ({$reason}). Send a new request id to try again.",
            $reason,
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return 409;
    }

    /**
     * @return array{reason: string}
     */
    protected function details(): array
    {
        return ['reason' => $this->reason];
    }
}
