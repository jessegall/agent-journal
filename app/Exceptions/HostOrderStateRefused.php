<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use App\Enums\Hosts\HostOrderStatus;
use RuntimeException;

/**
 * An order already answered or refused takes no second answer.
 */
final class HostOrderStateRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function alreadyEnded(string $orderId, HostOrderStatus $status): self
    {
        return new self("Order {$orderId} is {$status->value} already.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
