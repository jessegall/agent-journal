<?php

declare(strict_types=1);

namespace App\Agents\Values;

use JsonSerializable;

/**
 * One named parameter a key script request gives its script, such as server=journal.
 */
final readonly class ScriptParameter implements JsonSerializable
{
    public function __construct(
        public string $name,
        public string $parameterText,
    ) {}

    /**
     * The parameters as names and values.
     *
     * @param  list<self>  $parameters
     * @return array<string, string>
     */
    public static function byName(array $parameters): array
    {
        return array_column($parameters, 'parameterText', 'name');
    }

    /**
     * The parameters of names and values, in their order.
     *
     * @param  array<string, string>  $parameterTexts
     * @return list<self>
     */
    public static function listOf(array $parameterTexts): array
    {
        return array_map(
            fn (string $name, string $parameterText) => new self($name, $parameterText),
            array_keys($parameterTexts),
            $parameterTexts,
        );
    }

    /**
     * @return array{name: string, value: string}
     */
    public function jsonSerialize(): array
    {
        return ['name' => $this->name, 'value' => $this->parameterText];
    }
}
