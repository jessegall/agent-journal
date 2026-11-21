<?php

declare(strict_types=1);

namespace App\Connections\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A delivery the journal does not take: another tip under an id already used, or a claim that is not the calling
 * host's binding's.
 */
final class DeliveryRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function otherTip(string $deliveryId): self
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
