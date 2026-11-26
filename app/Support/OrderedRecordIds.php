<?php

declare(strict_types=1);

namespace App\Support;

use App\Assignments\Exceptions\InvalidRecordIds;
use Illuminate\Support\Str;

/**
 * Record ids in a chosen order, each once, at most 1,000. It has no cursor: it is the whole list.
 */
final readonly class OrderedRecordIds
{
    public const int LARGEST = 1000;

    /**
     * @param  list<string>  $ids
     *
     * @throws InvalidRecordIds
     */
    public function __construct(
        public array $ids,
    ) {
        if (count($ids) > self::LARGEST) {
            throw InvalidRecordIds::tooMany(count($ids), self::LARGEST);
        }

        if (count(array_unique($ids)) !== count($ids)) {
            throw InvalidRecordIds::repeated();
        }

        if (! array_all($ids, fn (string $id) => Str::isUlid($id))) {
            throw InvalidRecordIds::notUlids();
        }
    }
}
