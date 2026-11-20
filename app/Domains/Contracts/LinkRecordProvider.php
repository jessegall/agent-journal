<?php

declare(strict_types=1);

namespace App\Domains\Contracts;

use App\Records\Contracts\RecordProvider;

/**
 * A domain whose records can be linked and read through Core: each record type's link alias with its provider.
 */
interface LinkRecordProvider
{
    /**
     * @return array<string, class-string<RecordProvider>>
     */
    public function linkRecords(): array;
}
