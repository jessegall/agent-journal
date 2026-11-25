<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A delivery the journal does not take: another tip under an id already used, or a claim that is not the calling
 * host's binding's.
 */
final class DeliveryRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function otherCommit(string $deliveryId): self
    {
        return new self("Delivery {$deliveryId} already holds another commit.");
    }

    public static function notYourClaim(string $claimId): self
    {
        return new self("Child claim {$claimId} is not a claim of this host's binding.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return 409;
    }
}
