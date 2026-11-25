<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Attributes\Bus\Dispatches;
use App\Commands\Agents\RetireAgent\RetireAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Assignments\AssignmentResultData;
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
