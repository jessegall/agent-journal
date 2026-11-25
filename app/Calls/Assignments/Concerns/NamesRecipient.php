<?php

declare(strict_types=1);

namespace App\Calls\Assignments\Concerns;

use App\Support\AssigneeIdentity;

/**
 * A call that hands a record to a new holder.
 */
trait NamesRecipient
{
    public function recipient(): AssigneeIdentity
    {
        return new AssigneeIdentity($this->recipientType, strtolower($this->recipientId));
    }
}
