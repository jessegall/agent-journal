<?php

declare(strict_types=1);

namespace App\Assignments\Api\Concerns;

use App\Support\RecordIdentity;

/**
 * A call about one assignable record, named by its type and id.
 */
trait NamesAssignedRecord
{
    public function record(): RecordIdentity
    {
        return new RecordIdentity($this->recordType, strtolower($this->recordId));
    }
}
