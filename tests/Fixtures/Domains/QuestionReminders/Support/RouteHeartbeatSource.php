<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\Support;

use App\Agents\Contracts\AgentHeartbeatSource;
use Closure;

/**
 * A stand-in for the agent driver while it does not exist: it sends a quiet agent's beats to the heartbeat route
 * through the sender it is given, which signs them as the agent's launch.
 */
final readonly class RouteHeartbeatSource implements AgentHeartbeatSource
{
    public const string ROUTE = '/agent/heartbeat';

    /**
     * @param  Closure(string): int  $post  sends a signed POST to the path and answers the status
     */
    public function __construct(private Closure $post) {}

    public function beat(): int
    {
        return ($this->post)(self::ROUTE);
    }
}
