<?php

declare(strict_types=1);

namespace App\Records\Contracts;

/**
 * A fact about one record, named by its type and id.
 */
interface RecordFact
{
    /**
     * The type of the record the fact is about.
     */
    public function recordType(): string;

    /**
     * The id of the record the fact is about.
     */
    public function recordId(): string;
}
