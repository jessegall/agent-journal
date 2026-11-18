<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\ReviewRequest;
use App\Processes\Commands\RestoreCommandRule;
use Illuminate\Http\JsonResponse;

/**
 * A project owner restores an earlier revision as a new proposal; the bus refuses an agent.
 */
final readonly class RestoreRuleController
{
    public function __invoke(ReviewRequest $request, string $rule, CommandBus $commands): JsonResponse
    {
        $command = new RestoreCommandRule(
            $rule,
            $request->fromRevision(),
            $request->expectedRevision(),
            $request->requestKey(),
        );

        return new JsonResponse($commands->run($command)->toArray());
    }
}
