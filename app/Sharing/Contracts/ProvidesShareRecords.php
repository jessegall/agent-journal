<?php

declare(strict_types=1);

namespace App\Sharing\Contracts;

use App\Sharing\Support\ShareRecordRegistration;

/**
 * A domain whose records can be shared: each record type's alias with its model, provider and capabilities.
 */
interface ProvidesShareRecords
{
    /**
     * @return list<ShareRecordRegistration>
     */
    public function shareRecords(): array;
}
