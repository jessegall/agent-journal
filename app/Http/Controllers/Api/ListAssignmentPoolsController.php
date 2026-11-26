<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Assignments\Api\ListAssignmentPoolsPayload;
use App\Assignments\Api\PoolList;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Data\PoolDefinitionData;

/**
 * Lists the pools of one kind of record.
 */
final readonly class ListAssignmentPoolsController
{
    public function __invoke(ListAssignmentPoolsPayload $call, AssignmentProviders $providers): PoolList
    {
        $pools = array_map(PoolDefinitionData::of(...), $providers->pools($call->assignableType));

        return PoolList::from(['pools' => $pools]);
    }
}
