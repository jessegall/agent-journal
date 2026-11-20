<?php

declare(strict_types=1);

namespace App\Records\Models\Support;

use App\Records\Support\RecordIdentity;

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
