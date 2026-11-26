<?php

declare(strict_types=1);

namespace Domain\Sharing\Support\Gateways;

/**
 * Whether a gateway can open endpoints with a configuration, and the plain sentences the owner reads for each piece
 * that is missing.
 */
final readonly class GatewaySetupCheck
{
    /**
     * @param  list<string>  $problems
     */
    public function __construct(public array $problems) {}

    public static function passed(): self
    {
        return new self([]);
    }

    public function isComplete(): bool
    {
        return $this->problems === [];
    }
}
