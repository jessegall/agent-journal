<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Bus\ReceiptRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
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
