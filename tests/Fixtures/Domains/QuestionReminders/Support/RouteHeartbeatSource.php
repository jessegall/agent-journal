<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\Support;

use Closure;

/**
 * Sends a quiet agent's own beats to the agent heartbeat route through the sender it is given, which signs them as
 * the agent's launch.
 */
final readonly class RouteHeartbeatSource
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
