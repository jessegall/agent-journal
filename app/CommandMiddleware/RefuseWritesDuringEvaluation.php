<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Contracts\Bus\CommandMiddleware;
use App\Exceptions\ConditionWriteRefused;
use App\Support\CommandCall;
use App\Support\EvaluationGuard;
use Closure;

/**
 * Refuses every command run while a skill condition evaluates, before anything is written.
 */
final readonly class RefuseWritesDuringEvaluation implements CommandMiddleware
{
    public function __construct(
        private EvaluationGuard $guard,
    ) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        if ($this->guard->isEvaluating()) {
            throw ConditionWriteRefused::for($call->command::class);
        }

        return $next($call);
    }
}
