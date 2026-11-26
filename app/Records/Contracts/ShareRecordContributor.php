<?php

declare(strict_types=1);

namespace App\Records\Contracts;

use App\Records\Values\ShareRecordDefinition;

/**
 * A domain whose records can be shared: each record type's alias with its model, provider and capabilities.
 */
interface ShareRecordContributor
{
    /**
     * @return list<ShareRecordDefinition>
     */
    public function shareRecords(): array;
}
