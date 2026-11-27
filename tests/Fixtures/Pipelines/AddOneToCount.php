<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines;

use App\Bus\Contracts\Pipe;
use App\Bus\Contracts\PipelineContext;
use Closure;

/**
 * A fixture middleware that takes the context and the rest, and adds one to the count the rest returns.
 */
final readonly class AddOneToCount implements Pipe
{
    /**
     * @param  Closure(object): Counted  $next
     */
    public function handle(PipelineContext $context, Closure $next): Counted
    {
        return new Counted($next($context->carried())->count + 1);
    }
}
