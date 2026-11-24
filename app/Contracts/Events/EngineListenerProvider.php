<?php

declare(strict_types=1);

namespace App\Contracts\Events;

/**
 * A domain with periodic work of its own: the engine listeners it adds to every engine pass.
 */
interface EngineListenerProvider
{
    /**
     * The domain's engine listeners, each run on every pass inside the maintenance scope it declares.
     *
     * @return list<class-string<EngineListener>>
     */
    public function engineListeners(): array;
}
