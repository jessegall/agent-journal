<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Assignments\Exceptions\InvalidRecordIds;
use App\Records\Support\RecordIdentity;

/**
 * Which pool an auto-assignment draws from: its pool key, the record it is about when the pool needs one, and the
 * record ids it lists, each once and at most 1,000. The pool's factory checks the rest of its shape.
 */
final readonly class PoolReference
{
    /**
     * @var list<string>
     */
    public array $recordIds;

    /**
     * @param  list<string>  $recordIds
     *
     * @throws InvalidRecordIds
     */
    public function __construct(
        public string $type,
        public RecordIdentity|null $target,
        array $recordIds,
    ) {
        $this->recordIds = new OrderedRecordIds($recordIds)->ids;
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
