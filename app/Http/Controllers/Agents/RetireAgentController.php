<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Commands\RetireAgent\RetireAgentCommand;
use App\Assignments\Data\AssignmentResultData;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Agents\RetireAgentRequest;
use App\Support\AssignmentHolders;
use Illuminate\Http\JsonResponse;

/**
 * Retires an agent for good and answers with every record it released.
 */
final readonly class RetireAgentController
{
    #[Dispatches(RetireAgentCommand::class)]
    public function __invoke(RetireAgentRequest $request, CommandBus $commands): JsonResponse
    {
        return new JsonResponse(
            AssignmentResultData::of(
                $commands->run(new RetireAgentCommand($request->agentId())),
                new AssignmentHolders([]),
            ),
        );
    }
}
