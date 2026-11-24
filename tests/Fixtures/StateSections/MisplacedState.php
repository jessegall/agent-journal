<?php

declare(strict_types=1);

namespace Tests\Fixtures\StateSections;

use App\Support\Decisions\Decision;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;
use PhpOption\None;
use PhpOption\Option;

/**
 * A state whose own answer sits among its hooks, with its hooks against the contract's order.
 */
final class MisplacedState extends AgentState
{
    // ----------[ Hooks ]----------

    /**
     * @return Option<string>
     */
    public function instruction(): Option
    {
        return None::create();
    }

    public function onStop(StopRequested $input): Decision
    {
        return Decision::delegate();
    }

    public function onSessionStart(SessionStarted $input): Decision
    {
        return Decision::delegate();
    }
}
