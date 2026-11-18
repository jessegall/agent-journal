<?php

declare(strict_types=1);

namespace App\Hooks\Ticks;

/**
 * The state type keys whose loaders are marked as ticking.
 */
final readonly class TickingTypes
{
    /**
     * @param  list<string>  $typeKeys
     */
    public function __construct(private array $typeKeys) {}

    public function contains(string $typeKey): bool
    {
        return in_array($typeKey, $this->typeKeys, true);
    }

    /**
     * @return list<string>
     */
    public function typeKeys(): array
    {
        return $this->typeKeys;
    }
}
