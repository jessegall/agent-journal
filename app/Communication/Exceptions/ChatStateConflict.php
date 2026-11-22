<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\StaleRefusal;
use RuntimeException;

/**
 * A change to a chat row made against a state the row no longer has: an ended interval, a settled delivery or a
 * closed or stale speech opportunity.
 */
final class ChatStateConflict extends RuntimeException implements CodedRefusal, StaleRefusal
{
    use RendersRefusal;

    private function __construct(string $message, private readonly string $staleCode)
    {
        parent::__construct($message);
    }

    public static function intervalEnded(string $intervalId): self
    {
        return new self("Membership interval {$intervalId} has already ended.", 'interval-ended');
    }

    public static function deliverySettled(string $deliveryId): self
    {
        return new self("Receipt delivery {$deliveryId} is no longer pending.", 'delivery-settled');
    }

    public static function opportunityClosed(string $opportunityId): self
    {
        return new self(
            "Speech opportunity {$opportunityId} is already spent, declined or cancelled.",
            'opportunity-closed',
        );
    }

    public static function opportunityNotClaimed(string $opportunityId): self
    {
        return new self("Speech opportunity {$opportunityId} is not claimed.", 'opportunity-not-claimed');
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
