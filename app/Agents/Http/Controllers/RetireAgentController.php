<?php

declare(strict_types=1);

namespace App\Agents\Http\Controllers;

use App\Agents\Contracts\AgentRetirement;
use App\Agents\Http\Requests\RetireAgentRequest;
use App\Assignments\Http\Data\AssignmentResultData;
use App\Assignments\Support\AssignmentHolders;
use Illuminate\Http\JsonResponse;

/**
 * Retires an agent for good and answers with every record it released.
 */
final readonly class RetireAgentController
{
    public function __invoke(RetireAgentRequest $request, AgentRetirement $retirement): JsonResponse
    {
        return new JsonResponse(AssignmentResultData::of($retirement->retire($request->agentId()), new AssignmentHolders([])));
    }
}
