<?php

declare(strict_types=1);

namespace App\Drivers\Exceptions;

use App\Drivers\Enums\DriverCapability;
use RuntimeException;

final class DriverCapabilityUnsupported extends RuntimeException
{
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
}
