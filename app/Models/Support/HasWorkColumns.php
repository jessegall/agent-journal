<?php

declare(strict_types=1);

namespace App\Models\Support;

use App\Support\RecordIdentity;

/**
 * A row about one piece of work, which it names in work_type and work_id columns.
 */
trait HasWorkColumns
{
    /**
     * The work the row is about.
     */
    public function work(): RecordIdentity
    {
        $columns = $this->getAttributes();

        return new RecordIdentity((string) $columns['work_type'], (string) $columns['work_id']);
    }
}
