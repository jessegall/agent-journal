<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\RecordRole;
use App\Exceptions\ReaderDefinitionInvalid;

/**
 * A declarative, bounded reader of one check's output (doc 21 revision 6, section 72): its record rules in order,
 * the summary fields that count results and the one that holds their total, the field that counts failures, and its
 * limits per record and per read.
 */
final readonly class ReaderDefinition
{
    /**
     * @param  list<RecordRule>  $rules
     * @param  list<string>  $countFields  the summary fields that partition the total
     *
     * @throws ReaderDefinitionInvalid
     */
    public function __construct(
        public array $rules,
        public array $countFields = [],
        public string|null $totalField = null,
        public string|null $failureField = null,
        public int $maxRecordBytes = 65_536,
        public int $millisecondBudget = 2_000,
    ) {
        if ($maxRecordBytes < 1) {
            throw ReaderDefinitionInvalid::limit('maxRecordBytes', $maxRecordBytes);
        }

        if ($millisecondBudget < 1) {
            throw ReaderDefinitionInvalid::limit('millisecondBudget', $millisecondBudget);
        }
    }

    /**
     * The first rule that accounts for a line, in the order the definition lists them.
     */
    public function ruleFor(string $line): RecordRule|null
    {
        foreach ($this->rules as $rule) {
            if ($rule->matches($line)) {
                return $rule;
            }
        }

        return null;
    }

    public function hasRole(RecordRole $role): bool
    {
        return array_any($this->rules, fn (RecordRule $rule): bool => $rule->role === $role);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'rules' => array_map(
                fn (RecordRule $rule) => ['role' => $rule->role->value, 'pattern' => $rule->pattern],
                $this->rules,
            ),
            'count_fields' => $this->countFields,
            'total_field' => $this->totalField,
            'failure_field' => $this->failureField,
            'max_record_bytes' => $this->maxRecordBytes,
            'millisecond_budget' => $this->millisecondBudget,
        ];
    }

    /**
     * @param  array<string, mixed>  $fields
     *
     * @throws ReaderDefinitionInvalid
     */
    public static function fromArray(array $fields): self
    {
        $rules = [];

        foreach (self::listOf($fields, 'rules') as $rule) {
            if (! is_array($rule) || ! is_string($rule['role'] ?? null) || ! is_string($rule['pattern'] ?? null)) {
                throw ReaderDefinitionInvalid::field('rules');
            }

            $rules[] = RecordRule::of(RecordRole::from($rule['role']), $rule['pattern']);
        }

        return new self(
            $rules,
            array_values(array_filter(self::listOf($fields, 'count_fields'), is_string(...))),
            self::nameOf($fields, 'total_field'),
            self::nameOf($fields, 'failure_field'),
            (int) ($fields['max_record_bytes'] ?? 65_536),
            (int) ($fields['millisecond_budget'] ?? 2_000),
        );
    }

    /**
     * @param  array<string, mixed>  $fields
     * @return list<mixed>
     *
     * @throws ReaderDefinitionInvalid
     */
    private static function listOf(array $fields, string $key): array
    {
        $field = $fields[$key] ?? [];

        if (! is_array($field) || ! array_is_list($field)) {
            throw ReaderDefinitionInvalid::field($key);
        }

        return $field;
    }

    /**
     * @param  array<string, mixed>  $fields
     *
     * @throws ReaderDefinitionInvalid
     */
    private static function nameOf(array $fields, string $key): string|null
    {
        $field = $fields[$key] ?? null;

        if ($field !== null && ! is_string($field)) {
            throw ReaderDefinitionInvalid::field($key);
        }

        return $field;
    }
}
