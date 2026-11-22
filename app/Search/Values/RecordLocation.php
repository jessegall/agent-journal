<?php

declare(strict_types=1);

namespace App\Search\Values;

use App\Search\Exceptions\SearchValueInvalid;

/**
 * One passage inside a record: an id its owner never changes, such as a log entry's id, and the label a person
 * reads, such as Run 2, line 7. A mutable offset is never a location id.
 */
final readonly class RecordLocation
{
    public const int ID_BYTE_LIMIT = 64;

    public const int LABEL_CHARACTER_LIMIT = 80;

    /**
     * @throws SearchValueInvalid
     */
    public function __construct(
        public string $id,
        public string $label,
    ) {
        if (trim($id) === '') {
            throw SearchValueInvalid::blank('location id');
        }

        if (strlen($id) > self::ID_BYTE_LIMIT) {
            throw SearchValueInvalid::tooLong('location id', self::ID_BYTE_LIMIT);
        }

        if (trim($label) === '') {
            throw SearchValueInvalid::blank('location label');
        }

        if (mb_strlen($label) > self::LABEL_CHARACTER_LIMIT) {
            throw SearchValueInvalid::tooLong('location label', self::LABEL_CHARACTER_LIMIT);
        }
    }
}
