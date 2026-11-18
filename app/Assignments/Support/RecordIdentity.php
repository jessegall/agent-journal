<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Actors\Support\Concerns\ComparesTypeAndId;
use App\Assignments\Exceptions\InvalidAssignmentIdentity;
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
     * @throws InvalidAssignmentIdentity
     */
    public function __construct(
        public string $type,
        public string $id,
    ) {
        self::checkType($type);

        if (! Str::isUlid($id)) {
            throw InvalidAssignmentIdentity::forId($type, $id);
        }
    }

    /**
     * @throws InvalidAssignmentIdentity
     */
    public static function checkType(string $type): void
    {
        if (preg_match(self::ALIAS_PATTERN, $type) !== 1) {
            throw InvalidAssignmentIdentity::forType($type);
        }
    }
}
