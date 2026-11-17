<?php

declare(strict_types=1);

namespace App\Core\Hooks\States;

use App\Core\Hooks\Contracts\StateRegistration;
use App\Core\Hooks\Contracts\StateType;
use App\Core\Hooks\Exceptions\StateTypeRepeated;
use App\Core\Hooks\Exceptions\StateTypesFrozen;
use App\Core\Hooks\Exceptions\StateTypeUnknown;

/**
 * Every state type under its type key. Domains register theirs while it is being built; then it is frozen.
 */
final class StateTypeRegistry implements StateRegistration
{
    /**
     * @var array<string, StateType>
     */
    private array $types = [];

    private bool $isFrozen = false;

    public function register(string $typeKey, StateType $type): void
    {
        if ($this->isFrozen) {
            throw StateTypesFrozen::forKey($typeKey);
        }

        if ($this->has($typeKey)) {
            throw StateTypeRepeated::forKey($typeKey);
        }

        $this->types[$typeKey] = $type;
    }

    public function get(string $typeKey): StateType
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
