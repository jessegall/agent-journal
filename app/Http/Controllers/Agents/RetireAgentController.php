<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Commands\RetireAgent;
use App\Assignments\Support\AssignmentHolders;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Assignments\AssignmentResultData;
use App\Http\Requests\Agents\RetireAgentRequest;
use Illuminate\Http\JsonResponse;

/**
 * Retires an agent for good and answers with every record it released.
 */
final readonly class RetireAgentController
{
    public function __invoke(RetireAgentRequest $request, CommandBus $commands): JsonResponse
    {
        return new JsonResponse(AssignmentResultData::of($commands->run(new RetireAgent($request->agentId())), new AssignmentHolders([])));
    }
}
