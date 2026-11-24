<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Support\Octane\GiveRequestItsTimeLimit;
use Laravel\Octane\Events\RequestReceived;
use Tests\TestCase;

/**
 * Each request Octane starts gets the whole time limit from its own start, however long its worker has served.
 */
final class RequestTimeLimitTest extends TestCase
{
    public function test_a_received_request_starts_with_the_configured_time_limit(): void
    {
        config(['octane.max_execution_time' => 45]);
        $limitBefore = (int) ini_get('max_execution_time');
        set_time_limit(7);

        $this->app->make(GiveRequestItsTimeLimit::class)
            ->handle(new RequestReceived($this->app, $this->app, $this->app->make('request')));

        $limit = (int) ini_get('max_execution_time');
        set_time_limit($limitBefore);
        $this->assertSame(45, $limit);
    }
}
