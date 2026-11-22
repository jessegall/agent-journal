<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Support\AgentContext;
use Closure;
use PhpOption\Option;

/**
 * Reads and temporarily restores a captured signed call context.
 */
interface AgentCallContext
{
    /**
     * @return Option<AgentContext>
     */
    public function context(): Option;

    /**
     * @template TResult
     *
     * @param  Option<AgentContext>  $context
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function within(Option $context, Closure $work): mixed;
}
