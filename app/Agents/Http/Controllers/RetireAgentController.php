<?php

declare(strict_types=1);

namespace App\Agents\Http\Controllers;

use App\Agents\Commands\RetireAgent;
use App\Agents\Http\Requests\RetireAgentRequest;
use App\Assignments\Http\Data\AssignmentResultData;
use App\Assignments\Support\AssignmentHolders;
use App\Bus\Contracts\CommandBus;
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
