<?php

declare(strict_types=1);

namespace App\Skills\CommandMiddleware;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Support\CommandCall;
use App\Skills\Exceptions\ConditionWriteRefused;
use App\Skills\Support\EvaluationGuard;
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
