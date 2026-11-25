<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Records\RecordRole;
use App\Exceptions\ReaderDefinitionInvalid;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A declarative, bounded reader of one check's output: its record rules in order,
 * the summary fields that count results and the one that holds their total, the field that counts failures, and its
 * limits per record and per read.
 */
#[MapName(SnakeCaseMapper::class)]
final class ReaderDefinition extends Data
{
    /**
     * @param  list<RecordRule>  $rules
     * @param  list<string>  $countFields  the summary fields that partition the total
     *
     * @throws ReaderDefinitionInvalid
     */
    public function __construct(
        #[DataCollectionOf(RecordRule::class)]
        public readonly array $rules,
        public readonly array $countFields = [],
        public readonly string|null $totalField = null,
        public readonly string|null $failureField = null,
        public readonly int $maxRecordBytes = 65_536,
        public readonly int $millisecondBudget = 2_000,
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
}
