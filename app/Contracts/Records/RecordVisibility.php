<?php

declare(strict_types=1);

namespace App\Contracts\Records;

use App\Support\RecordIdentity;

/**
 * Whether the actor of this request may see one record; a missing, hidden or unregistered record answers alike.
 */
interface RecordVisibility
{
    /**
     * Whether the current reader may see the record.
     */
    public function isVisible(RecordIdentity $record): bool;
}
