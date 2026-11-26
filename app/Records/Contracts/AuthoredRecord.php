<?php

declare(strict_types=1);

namespace App\Records\Contracts;

use App\Support\ActorReference;

/**
 * A record one actor made, such as a message, a question or a run.
 */
interface AuthoredRecord
{
    /**
     * The actor who made the record; the system actor for a record nobody started.
     */
    public function author(): ActorReference;
}
