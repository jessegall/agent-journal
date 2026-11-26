<?php

declare(strict_types=1);

namespace App\Support;

use App\Assignments\Exceptions\InvalidRecordIds;
use Spatie\LaravelData\Data;

/**
 * Which pool an auto-assignment draws from: its pool key, the record it is about when the pool needs one, and the
 * record ids it lists, each once and at most 1,000. The pool's factory checks the rest of its shape.
 */
final class PoolReference extends Data
{
    /**
     * @param  list<string>  $recordIds
     *
     * @throws InvalidRecordIds
     */
    public function __construct(
        public readonly string $type,
        public readonly RecordIdentity|null $target,
        public readonly array $recordIds,
    ) {
        new OrderedRecordIds($recordIds);
    }

    /**
     * Whether the other reference names the same pool, target and ids in the same order.
     */
    public function isSameAs(self $other): bool
    {
        $sameTarget = $this->target === null
            ? $other->target === null
            : $other->target !== null && $this->target->isSameAs($other->target);

        return $this->type === $other->type && $sameTarget && $this->recordIds === $other->recordIds;
    }
}
