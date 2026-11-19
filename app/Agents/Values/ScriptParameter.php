<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * One named parameter a key script request gives its script, such as server=journal.
 */
final readonly class ScriptParameter
{
    public function __construct(
        public string $name,
        public string $value,
    ) {}

    /**
     * The parameters as names and values.
     *
     * @param  list<self>  $parameters
     * @return array<string, string>
     */
    public static function byName(array $parameters): array
    {
        return array_column(array_map(fn (self $parameter) => (array) $parameter, $parameters), 'value', 'name');
    }

    /**
     * The parameters of names and values, in their order.
     *
     * @param  array<string, string>  $values
     * @return list<self>
     */
    public static function listOf(array $values): array
    {
        return array_map(fn (string $name, string $value) => new self($name, $value), array_keys($values), $values);
    }
}
