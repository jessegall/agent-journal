<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * No usable gateway configuration stands behind a share: the one named is missing or disabled, or no default is set.
 */
final class ShareGatewayUnavailable extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function forConfiguration(string $configurationId): self
    {
        return new self("Gateway configuration {$configurationId} does not exist or is disabled.");
    }

    public static function noDefault(): self
    {
        return new self('No default gateway is configured; configure a gateway before sharing.');
    }

    protected function status(): int
    {
        return 422;
    }
}
