<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Exceptions\RequestKeyMissing;

/**
 * The receipt the outermost command of this request was accepted under, for a write that keeps it as its origin.
 */
final class AcceptedReceipt
{
    private string|null $receiptId = null;

    public function accept(string $receiptId): void
    {
        $this->receiptId = $receiptId;
    }

    /**
     * @param  class-string  $command
     *
     * @throws RequestKeyMissing
     */
    public function requireFor(string $command): string
    {
        return $this->receiptId ?? throw RequestKeyMissing::for($command);
    }
}
