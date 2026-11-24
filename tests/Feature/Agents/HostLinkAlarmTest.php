<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Enums\HostRouteRole;
use App\Models\Projects\Host;
use App\Support\HostLinkAlarms;
use Illuminate\Support\Facades\Route;
use RuntimeException;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

/**
 * A host whose calls the journal fails for longer than a minute shows on every page with the reason its last call got,
 * and the alarm clears by itself on the next call the journal answers; the calls a host reports failed on its own side
 * are kept with it.
 */
final class HostLinkAlarmTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const string FAILING_ROUTE = '/host/link-alarm-test/failing';

    private const string REASON = 'Maximum execution time of 30 seconds exceeded';

    private const string ANSWERED_ROUTE = '/host/claim?limit=10&wait=0&watched_version=0';

    protected function setUp(): void
    {
        parent::setUp();

        Route::post(self::FAILING_ROUTE, fn () => throw new RuntimeException(self::REASON))
            ->middleware('journal.host:'.HostRouteRole::Shared->value);
    }

    public function test_a_host_failing_past_a_minute_shows_the_reason_and_the_next_answered_call_clears_it(): void
    {
        $host = $this->enrolledHost();
        $this->hostCall($host, self::FAILING_ROUTE)->assertServerError();
        $this->travel(2)->minutes();

        $alarms = $this->app->make(HostLinkAlarms::class)->current();

        $name = Host::query()->findOrFail($host->hostId)->installation_name;
        $this->assertCount(1, $alarms);
        $this->assertStringStartsWith("The host {$name} has failed to reach the journal since ", $alarms[0]);
        $this->assertStringEndsWith(self::FAILING_ROUTE.' answered 500: '.self::REASON.'.', $alarms[0]);

        $this->hostCall($host, self::ANSWERED_ROUTE)->assertSuccessful();

        $this->assertSame([], $this->app->make(HostLinkAlarms::class)->current());
    }

    public function test_a_failure_shorter_than_a_minute_raises_no_alarm(): void
    {
        $host = $this->enrolledHost();

        $this->hostCall($host, self::FAILING_ROUTE)->assertServerError();

        $this->assertSame([], $this->app->make(HostLinkAlarms::class)->current());
    }

    public function test_the_calls_a_host_reports_failed_on_its_side_are_kept_with_it(): void
    {
        $host = $this->enrolledHost();
        $reported = [['route' => '/host/claim', 'status' => 0, 'reason' => 'connection refused', 'since' => '2026-11-24T10:00:00Z']];

        $this->hostCallReporting($host, self::ANSWERED_ROUTE, $reported)->assertSuccessful();

        $this->assertSame($reported, Host::query()->findOrFail($host->hostId)->reported_failures);
    }
}
