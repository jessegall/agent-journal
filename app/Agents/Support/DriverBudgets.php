<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * The budgets of the driver ledger (config agents.driver_budgets): the most requests one host poll takes, the
 * longest a poll waits, and the largest message a delivery carries.
 */
final readonly class DriverBudgets
{
    public function __construct(
        public int $claimBatchMax,
        public int $longPollMaxSeconds,
        public int $deliverMaxBytes,
    ) {}

    public function fitsDelivery(string $message): bool
    {
        return strlen($message) <= $this->deliverMaxBytes;
    }
}
