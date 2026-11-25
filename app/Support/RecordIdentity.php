<?php

declare(strict_types=1);

namespace App\Support;

use App\Concerns\ComparesTypeAndId;
use App\Exceptions\InvalidRecordIdentity;
use Illuminate\Support\Str;
use Spatie\LaravelData\Data;

/**
 * A record by its link alias, such as tasks.task, and its ULID. Whether the alias is registered is checked when
 * the record is resolved, not here.
 */
final class RecordIdentity extends Data
{
    use ComparesTypeAndId;

    private const string ALIAS_PATTERN = '/^[a-z][a-z0-9_-]*(?:\.[a-z][a-z0-9_-]*)+$/';

    /**
     * @throws InvalidRecordIdentity
     */
    public function __construct(
        public readonly string $type,
        public readonly string $id,
    ) {
        self::assertKnownType($type);

        if (! Str::isUlid($id)) {
            throw InvalidRecordIdentity::forId($type, $id);
        }
    }

    /**
     * The record as one text, its type and id joined by a colon, as a start keeps its owner's work.
     */
    public function reference(): string
    {
        return "{$this->type}:{$this->id}";
    }

    /**
     * The records whose id is among the found ones, in their own order.
     *
     * @param  list<self>  $records
     * @param  array<mixed>  $found  the ids a query found, as it plucked them
     * @return list<self>
     */
    public static function among(array $records, array $found): array
    {
        return array_values(array_filter($records, fn (self $record) => in_array($record->id, $found, true)));
    }

    public static function assertKnownType(string $type): void
    {
        if (preg_match(self::ALIAS_PATTERN, $type) !== 1) {
            throw InvalidRecordIdentity::forType($type);
        }
    }
}
