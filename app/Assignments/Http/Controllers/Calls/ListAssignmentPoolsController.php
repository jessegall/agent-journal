<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers\Calls;

use App\Assignments\Calls\ListAssignmentPoolsCall;
use App\Assignments\Calls\PoolList;
use App\Assignments\Contracts\AssignmentProviders;
use App\Http\Data\Assignments\PoolDefinitionData;

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
