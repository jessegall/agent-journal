<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\ReviewRequest;
use App\Processes\Commands\RetireCommandRule;
use Illuminate\Http\JsonResponse;

/**
 * A project owner retires an active rule at the revision they read; the bus refuses an agent.
 */
final readonly class RetireRuleController
{
    public function __invoke(ReviewRequest $request, string $rule, CommandBus $commands): JsonResponse
    {
        $command = new RetireCommandRule($rule, $request->expectedRevision(), $request->reason());

        return new JsonResponse(['rule_id' => $commands->run($command), 'state' => 'retired']);
    }
}
