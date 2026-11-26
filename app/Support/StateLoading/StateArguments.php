<?php

declare(strict_types=1);

namespace App\Support\StateLoading;

use App\Stacks\StateLoading\RegisteredStateType;
use App\Stacks\StateLoading\StateValues;
use App\Support\DeclaredType;

/**
 * A state's saved values on their way to its constructor: the values as stored, those cast so far for its constructor,
 * by parameter name, and those cast for its other data properties, written after it is made.
 */
final readonly class StateArguments
{
    /**
     * @param  array<string, mixed>  $values
     * @param  array<string, mixed>  $constructorValues
     * @param  array<string, mixed>  $propertyValues
     */
    public function __construct(
        public RegisteredStateType $type,
        public array $values,
        public array $constructorValues = [],
        public array $propertyValues = [],
    ) {}

    /**
     * @param  array<string, mixed>  $values
     */
    public function withConstructorValues(array $values): self
    {
        return clone ($this, ['constructorValues' => $values]);
    }

    /**
     * @param  array<string, mixed>  $values
     */
    public function withPropertyValues(array $values): self
    {
        return clone ($this, ['propertyValues' => $values]);
    }

    /**
     * The saved value of the name, cast to the type the state declares for it.
     */
    public function castValue(string $name, DeclaredType $declared): mixed
    {
        return StateValues::cast($this->type, $name, $declared, $this->values[$name]);
    }
}
