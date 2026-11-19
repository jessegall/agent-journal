<?php

declare(strict_types=1);

namespace App\Assignments\Calls\Concerns;

use App\Assignments\Support\AssigneeIdentity;

/**
 * A call that hands a record to a new holder.
 */
trait NamesRecipient
{
    public function recipient(): AssigneeIdentity
    {
        return new AssigneeIdentity($this->recipientType->value, strtolower($this->recipientId));
    }
}
