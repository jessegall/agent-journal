<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Agents\Support\StackTarget;
use App\Engine\Support\EngineAccess;
use App\Engine\Support\EnginePass;
use App\Hooks\Support\StackTransaction;
use Closure;

/**
 * Runs test work as an engine handler would: in an engine pass, with a frame grant for one target, in a transaction.
 */
trait RunsAsEngine
{
    /**
     * @param  Closure(): void  $work
     */
    private function asEngineFor(StackTarget $target, Closure $work): void
    {
        $this->app->make(EnginePass::class)->run(function () use ($target, $work): void {
            $this->app->make(EngineAccess::class)->grantFrame($target, 'frame-of-the-tick');
            $this->app->make(StackTransaction::class)->run($work);
        });
    }
}
