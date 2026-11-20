<?php

declare(strict_types=1);

namespace App\Records\Support;

use App\Actors\Support\Concerns\ComparesTypeAndId;
use App\Records\Exceptions\InvalidRecordIdentity;
use Illuminate\Support\Str;

/**
 * A record by its link alias, such as tasks.task, and its ULID. Whether the alias is registered is checked when
 * the record is resolved, not here.
 */
final readonly class RecordIdentity
{
    use ComparesTypeAndId;

    private const string ALIAS_PATTERN = '/^[a-z][a-z0-9_-]*\.[a-z][a-z0-9_-]*$/';

    /**
     * @throws InvalidRecordIdentity
     */
    public function __construct(
        public string $type,
        public string $id,
    ) {
        self::assertKnownType($type);

        if (! Str::isUlid($id)) {
            throw InvalidRecordIdentity::forId($type, $id);
        }
    }

    /**
     * @throws InvalidRecordIdentity
     */
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
