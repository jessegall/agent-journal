<?php

declare(strict_types=1);

namespace App\Hooks\States\Support;

use App\Hooks\Contracts\StateLoader;
use App\Hooks\Contracts\StateRegistration;
use App\Hooks\Exceptions\StateTypeRepeated;
use App\Hooks\Exceptions\StateTypesFrozen;
use App\Hooks\Exceptions\StateTypeUnknown;

/**
 * Every state type under its type key. Domains register theirs while it is being built; then it is frozen.
 */
final class StateTypeRegistry implements StateRegistration
{
    /**
     * @var array<string, StateLoader>
     */
    private array $types = [];

    private bool $isFrozen = false;

    public function register(string $typeKey, StateLoader $type): void
    {
        if ($this->isFrozen) {
            throw StateTypesFrozen::forKey($typeKey);
        }

        if ($this->has($typeKey)) {
            throw StateTypeRepeated::forKey($typeKey);
        }

        $this->types[$typeKey] = $type;
    }

    public function get(string $typeKey): StateLoader
    {
        return $this->types[$typeKey] ?? throw StateTypeUnknown::forKey($typeKey);
    }

    public function has(string $typeKey): bool
    {
        return isset($this->types[$typeKey]);
    }

    public function freeze(): void
    {
        $this->isFrozen = true;
    }
}
