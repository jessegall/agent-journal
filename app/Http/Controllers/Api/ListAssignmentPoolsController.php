<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Assignments\ListAssignmentPoolsPayload;
use App\Api\Assignments\PoolList;
use App\Contracts\Assignments\AssignmentProviders;
use App\Data\Assignments\PoolDefinitionData;

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
