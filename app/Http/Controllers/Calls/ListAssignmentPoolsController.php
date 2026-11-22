<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Assignments\ListAssignmentPoolsCall;
use App\Calls\Assignments\PoolList;
use App\Contracts\Assignments\AssignmentProviders;
use App\Data\Assignments\PoolDefinitionData;

/**
 * Lists the pools of one kind of record.
 */
final readonly class ListAssignmentPoolsController
{
    public function __invoke(ListAssignmentPoolsCall $call, AssignmentProviders $providers): PoolList
    {
        $pools = array_map(PoolDefinitionData::of(...), $providers->pools($call->assignableType));

        return PoolList::from(['pools' => $pools]);
    }
}
