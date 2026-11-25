<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Bus\ReceiptRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Contracts\Refusals\RefusalRecovery;
use App\Enums\Engine\RefusalCode;
use App\Values\RecoveryCall;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * The refusal a write got the first time, given again to a retry with the same request key.
 */
final class RefusalReplayed extends RuntimeException implements
    CodedRefusal,
    CommandRefusal,
    ReceiptRefusal,
    RefusalRecovery
{
    use RendersRefusal;

    private function __construct(
        private readonly RefusalCode $storedCode,
        string $message,
        private readonly RecoveryCall|null $storedRecovery,
    ) {
        parent::__construct($message);
    }

    public static function of(RefusalCode $code, string $message, RecoveryCall|null $recovery): self
    {
        return new self($code, $message, $recovery);
    }

    public function refusalCode(): RefusalCode
    {
        return $this->storedCode;
    }

    public function recovery(): RecoveryCall|null
    {
        return $this->storedRecovery;
    }

    /**
     * @return array<string, mixed>
     */
    protected function details(): array
    {
        return RecoveryCall::detailsOf($this->storedRecovery);
    }

    protected function status(): int
    {
        return Response::HTTP_CONFLICT;
    }
}
