<?php

declare(strict_types=1);

namespace App\Desks\Contracts;

use App\Actors\Contracts\Actor;
use App\Assignments\Support\Page;
use App\Assignments\Support\RecordIds;

/**
 * The records of one type an actor works on: those assigned to it directly and those held by the desks it sits at.
 */
interface DeskWorkResolver
{
    public function recordIdsFor(string $type, Actor $actor, Page $page): RecordIds;
}
