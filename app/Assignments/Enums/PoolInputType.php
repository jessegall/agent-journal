<?php

declare(strict_types=1);

namespace App\Assignments\Enums;

/**
 * What a pool reference must carry for a pool: nothing beyond its key, a target record, or a list of record ids.
 */
enum PoolInputType: string
{
    case None = 'none';
    case Target = 'target';
    case RecordIds = 'record_ids';
}
