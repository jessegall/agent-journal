<?php

declare(strict_types=1);

namespace App\Sharing;

/**
 * Whether an open endpoint answered its probe, and the plain sentences the owner reads for each way it did not.
 */
final readonly class GatewayHealth
{
    /**
     * @param  list<string>  $problems
     */
    public function __construct(public array $problems) {}

    public static function healthy(): self
    {
        return new self([]);
    }

    public function isHealthy(): bool
    {
        return $this->problems === [];
    }
}
