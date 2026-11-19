<?php

declare(strict_types=1);

namespace Domain\Plans\Calls\Concerns;

use App\Records\Support\RecordIdentity;

/**
 * A call about the work under one plan or phase, named by its type and id.
 */
trait NamesPlanWorkRoot
{
    public function rootRecord(): RecordIdentity
    {
        return new RecordIdentity($this->rootType, strtolower($this->rootId));
    }
}
