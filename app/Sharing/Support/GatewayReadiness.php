<?php

declare(strict_types=1);

namespace App\Sharing\Support;

/**
 * Whether a gateway can open endpoints with a configuration, and the plain sentences the owner reads for each piece
 * that is missing.
 */
final readonly class GatewayReadiness
{
    /**
     * @param  list<string>  $problems
     */
    public function __construct(public array $problems) {}

    public static function ready(): self
    {
        return new self([]);
    }

    public function isReady(): bool
    {
        return $this->problems === [];
    }
}
