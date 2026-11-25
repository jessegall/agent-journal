<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Contracts;

/**
 * A test attribute that names one way into the journal.
 */
interface NamesEntry
{
    /**
     * The entry's name as the architecture test lists it: a class, a route's method and name, or a protocol and moment.
     */
    public function entryName(): string;
}
