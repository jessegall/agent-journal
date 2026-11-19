<?php

declare(strict_types=1);

namespace App\AgentRequests\Contracts;

use App\AgentRequests\Support\AgentClientSettings;

/**
 * Where a started program finds the journal's address and its start token; the relay, hooks and CLI all ask here.
 */
interface StartTokenSource
{
    public function forThisStart(): AgentClientSettings;
}
