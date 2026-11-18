<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Assignments\Enums\PoolMembersType;
use App\Assignments\Exceptions\InvalidRecordIds;

/**
 * The records a pool holds: every record of its type, or the listed ids in their order, each once and at most 1,000.
 */
final readonly class PoolMembers
{
    private function __construct(
        public PoolMembersType $type,
        public OrderedRecordIds $ids,
    ) {}

    public static function all(): self
    {
        return new self(PoolMembersType::All, new OrderedRecordIds([]));
    }

    /**
     * @param  list<string>  $ids
     *
     * @throws InvalidRecordIds
     */
    public static function ordered(array $ids): self
    {
        return new self(PoolMembersType::Ordered, new OrderedRecordIds($ids));
    }
}
