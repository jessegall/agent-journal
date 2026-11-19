<?php

declare(strict_types=1);

namespace Tests\Support\Engine;

use App\Engine\Support\EnginePass;

/**
 * Runs work inside one engine pass, with the fresh scope a pass of the ticker gives it.
 */
trait RunsEnginePasses
{
    private function pass(callable $work): void
    {
        $this->app->make(EnginePass::class)->run($work);
    }
}
