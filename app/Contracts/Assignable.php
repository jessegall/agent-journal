<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\RecordIdentity;

/**
 * A record someone can be made responsible for, such as a task, a plan or a phase. It names itself by its stable link
 * alias and id, never by its model class.
 */
interface Assignable
{
    public function assignmentIdentity(): RecordIdentity;
}
