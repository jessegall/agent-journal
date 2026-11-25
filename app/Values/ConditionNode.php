<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\SkillConditionInvalid;

/**
 * One object of a condition document as written: its place in the document, its type and version, and its other
 * fields read by name. Reading it checks only that it is an object with a text type and a whole-number version.
 */
final readonly class ConditionNode
{
    /**
     * @param  array<array-key, mixed>  $fields
     */
    private function __construct(
        public string $path,
        public string $type,
        public int $version,
        private array $fields,
    ) {}

    /**
     * @throws SkillConditionInvalid
     */
    public static function read(mixed $wire, string $path): self
    {
        if (! is_array($wire) || array_is_list($wire) && $wire !== []) {
            throw SkillConditionInvalid::field($path, 'is not an object');
        }

        $type = $wire['type'] ?? null;
        $version = $wire['version'] ?? null;

        if (! is_string($type)) {
            throw SkillConditionInvalid::field("{$path}.type", 'is missing or not text');
        }

        if (! is_int($version)) {
            throw SkillConditionInvalid::field("{$path}.version", 'is missing or not a whole number');
        }

        return new self($path, $type, $version, $wire);
    }

    /**
     * Refuses a version other than the type's, and any field the type does not take.
     *
     * @param  list<string>  $fields
     *
     * @throws SkillConditionInvalid
     */
    public function requireShape(int $version, array $fields): void
    {
        if ($this->version !== $version) {
            $problem = "is {$this->version}, which this type does not support";

            throw SkillConditionInvalid::field($this->at('version'), $problem);
        }

        foreach (array_keys($this->fields) as $field) {
            if (! in_array($field, [
                'type',
                'version',
                ...$fields,
            ], true)) {
                throw SkillConditionInvalid::field($this->at((string) $field), 'is not a field of this type');
            }
        }
    }

    /**
     * Whether the node has the field at all.
     */
    public function hasField(string $name): bool
    {
        return array_key_exists($name, $this->fields);
    }

    /**
     * The field as written; a node without it is refused with the problem the caller names.
     *
     * @throws SkillConditionInvalid
     */
    public function field(string $name, string $missingProblem): mixed
    {
        if (! $this->hasField($name)) {
            throw SkillConditionInvalid::field($this->at($name), $missingProblem);
        }

        return $this->fields[$name];
    }

    /**
     * The place of one of the node's fields in the document, such as conditions.children[0].keys.
     */
    public function at(string $field): string
    {
        return "{$this->path}.{$field}";
    }
}
