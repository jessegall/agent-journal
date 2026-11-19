<?php

declare(strict_types=1);

namespace App\Assignments\Calls\Concerns;

use App\Assignments\Support\AutoAssignmentInput;
use App\Assignments\Support\PoolReference;
use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordResolver;

/**
 * A call that sets the pool an auto-assignment takes from and how many it keeps in hand.
 */
trait NamesAssignmentPool
{
    public function input(RecordResolver $records): AutoAssignmentInput
    {
        $ids = array_map(fn (string $name) => $records->identify(RecordReference::parse($name))->id, $this->records);
        $target = $this->target === null ? null : $records->identify(RecordReference::parse($this->target));

        return new AutoAssignmentInput($this->key(), new PoolReference($this->pool, $target, $ids), $this->size);
    }
}
