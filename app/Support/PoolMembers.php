<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Assignments\PoolMembersType;
use App\Exceptions\InvalidRecordIds;

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
