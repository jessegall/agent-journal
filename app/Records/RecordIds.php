<?php

declare(strict_types=1);

namespace App\Records;

/**
 * One page of the ids of records of one type an actor holds, ascending, and where the next page starts, or null on the
 * last page. It carries no total, so nothing about hidden records leaks.
 */
final readonly class RecordIds
{
    /**
     * @param  list<string>  $ids
     */
    public function __construct(
        public array $ids,
        public string|null $nextAfterId,
    ) {}
}
