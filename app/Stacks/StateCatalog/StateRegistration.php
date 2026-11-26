<?php

declare(strict_types=1);

namespace App\Stacks\StateCatalog;

use App\Stacks\Exceptions\StateTypeRepeated;
use App\Stacks\Exceptions\StateTypesFrozen;
use App\Stacks\Exceptions\StateTypeUnknown;
use App\Stacks\StateLoading\RegisteredStateType;
use App\Support\Registry;
use App\Support\StateCatalog\Registration\Contracts\StateRegistration as StateRegistrationContract;

/**
 * Every state type under its type key. Domains register theirs while it is being built; then it is frozen.
 */
final class StateRegistration implements StateRegistrationContract
{
    /**
     * @var Registry<RegisteredStateType>
     */
    private readonly Registry $types;

    private bool $isFrozen = false;

    public function __construct()
    {
        $this->types = Registry::once(StateTypeUnknown::forKey(...), StateTypeRepeated::forKey(...));
    }

    public function register(RegisteredStateType $type): void
    {
        if ($this->isFrozen) {
            throw StateTypesFrozen::forKey($type->key);
        }

        $this->types->put($type->key, $type);
    }

    public function get(string $typeKey): RegisteredStateType
    {
        return $this->types->get($typeKey);
    }

    /**
     * @return array<string, RegisteredStateType>
     */
    public function types(): array
    {
        return $this->types->all();
    }

    public function has(string $typeKey): bool
    {
        return $this->types->has($typeKey);
    }

    /**
     * The type keys whose state ticks.
     *
     * @return list<string>
     */
    public function tickingTypeKeys(): array
    {
        return array_keys(array_filter($this->types->all(), fn (RegisteredStateType $type) => $type->isTicking()));
    }

    public function freeze(): void
    {
        $this->isFrozen = true;
    }
}
