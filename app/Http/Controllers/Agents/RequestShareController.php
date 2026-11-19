<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Bus\Contracts\CommandBus;
use App\Http\Data\Sharing\ShareProposalStatusData;
use App\Http\Requests\Agents\RequestShareRequest;
use App\Records\Contracts\RecordResolver;
use App\Sharing\Commands\RequestShare;
use Illuminate\Http\JsonResponse;

/**
 * An agent proposes sharing a record it may read; it is answered with the proposal's number and state only.
 */
final readonly class RequestShareController
{
    public function __invoke(RequestShareRequest $request, RecordResolver $records, CommandBus $commands): JsonResponse
    {
        $root = $records->identify($request->reference());

        return new JsonResponse(ShareProposalStatusData::fromStatus($commands->run(new RequestShare($root->type, $root->id, $request->requestKey()))));
    }
}
