<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Support\AgentClientSettings;

/**
 * Where a started driver finds the journal's address and its start token; the relay, hooks and CLI all ask here.
 */
interface StartTokenSource
{
    /**
     * The address and token the started agent reaches the journal with.
     */
    public function forThisStart(): AgentClientSettings;
}
