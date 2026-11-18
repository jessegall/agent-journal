<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Records\Support\RecordIdentity;

/**
 * Whether the actor of this request may see one record; a missing, hidden or unregistered record answers alike.
 */
interface RecordVisibility
{
    public function isVisible(RecordIdentity $record): bool;
}
