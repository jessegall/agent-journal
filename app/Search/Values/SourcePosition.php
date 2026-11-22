<?php

declare(strict_types=1);

namespace App\Search\Values;

use App\Search\Exceptions\SearchValueInvalid;

/**
 * Where a source stopped: the fields its own provider chose, such as a tier, the last examined id and a high
 * water. Only the owning provider reads them; the search keeps them and compares two for equality.
 */
final readonly class SourcePosition
{
    public const int FIELD_LIMIT = 16;

    public const int TEXT_BYTE_LIMIT = 64;

    /**
     * @param  array<string, int|string>  $fields
     */
    private function __construct(public array $fields) {}

    /**
     * @param  array<string, int|string>  $fields
     *
     * @throws SearchValueInvalid
     */
    public static function of(array $fields): self
    {
        if (count($fields) > self::FIELD_LIMIT) {
            throw SearchValueInvalid::outOfRange('position field count', 1, self::FIELD_LIMIT);
        }

        foreach ($fields as $name => $value) {
            if (preg_match('/^[a-z][a-z_]*$/', $name) !== 1) {
                throw SearchValueInvalid::forPositionField($name);
            }

            if (is_string($value) && strlen($value) > self::TEXT_BYTE_LIMIT) {
                throw SearchValueInvalid::forPositionField($name);
            }
        }

        ksort($fields, SORT_STRING);

        return new self($fields);
    }

    public function integer(string $name): int
    {
        $value = $this->fields[$name] ?? throw SearchValueInvalid::forPositionField($name);

        if (! is_int($value)) {
            throw SearchValueInvalid::forPositionField($name);
        }

        return $value;
    }

    public function text(string $name): string
    {
        $value = $this->fields[$name] ?? throw SearchValueInvalid::forPositionField($name);

        if (! is_string($value)) {
            throw SearchValueInvalid::forPositionField($name);
        }

        return $value;
    }

    public function equals(self $other): bool
    {
        return $this->fields === $other->fields;
    }
}
