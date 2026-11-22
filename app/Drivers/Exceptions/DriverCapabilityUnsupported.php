<?php

declare(strict_types=1);

namespace App\Drivers\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use App\Drivers\Enums\DriverCapability;
use RuntimeException;

/**
 * A driver cannot do what a start needs on this host; the start is refused before it is accepted, with the reason.
 */
final class DriverCapabilityUnsupported extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public function __construct(
        public readonly DriverCapability $capability,
        public readonly string $reason,
    ) {
        parent::__construct(sprintf('The driver cannot %s here: %s', $capability->value, $reason));
    }

    public static function for(DriverCapability $capability, string $reason): self
    {
        return new self($capability, $reason);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Unavailable;
    }

    protected function status(): int
    {
        return 409;
    }
}
