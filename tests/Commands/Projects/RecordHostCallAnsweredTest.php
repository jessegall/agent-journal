<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\RecordHostCallAnswered\RecordHostCallAnsweredCommand;
use App\Enums\Projects\HostRouteRole;
use App\Models\Projects\Host;
use App\Support\HostLinkAlarms;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Route;
use RuntimeException;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A host whose calls the journal fails for longer than a minute shows on every page with the reason its last call got,
 * and the alarm clears by itself on the next call the journal answers; the calls a host reports failed on its own side
 * are kept with it.
 */
#[TestsCommand(RecordHostCallAnsweredCommand::class)]
final class RecordHostCallAnsweredTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['hosts'];

    private const string FAILING_ROUTE = '/host/link-alarm-test/failing';

    private const string REASON = 'Maximum execution time of 30 seconds exceeded';

    private const string ANSWERED_ROUTE = '/host/orders/claim?limit=10&wait=0';

    private const string FAILING_ROUTE_ANSWERED = '/host/link-alarm-test/answered';

    /**
     * Whether the failing route still fails; set false, it answers.
     */
    private bool $isFailing = true;

    protected function setUp(): void
    {
        parent::setUp();

        Route::post(self::FAILING_ROUTE, fn () => $this->isFailing ? throw new RuntimeException(self::REASON) : [])
            ->middleware('journal.host:'.HostRouteRole::Shared->value);
        Route::post(self::FAILING_ROUTE_ANSWERED, fn () => [])->middleware(
            'journal.host:'.HostRouteRole::Shared->value,
        );
    }

    public function test_a_host_failing_past_a_minute_shows_the_reason_and_an_answer_on_that_route_clears_it(): void
    {
        $host = $this->journal->enrolledHost();
        $this->journal->hostCall($host, 'POST', self::FAILING_ROUTE)->assertServerError();
        $this->travel(2)->minutes();

        $alarms = $this->app->make(HostLinkAlarms::class)->current();

        $this->assertSame([Host::query()->findOrFail($host->hostId)->link_alarm], $alarms);
        $this->assertStringContainsString(self::FAILING_ROUTE, $alarms[0]);
        $this->assertStringContainsString(self::REASON, $alarms[0]);

        $this->isFailing = false;
        $this->journal->hostCall($host, 'POST', self::FAILING_ROUTE)->assertSuccessful();

        $this->assertSame([], $this->app->make(HostLinkAlarms::class)->current());
    }

    public function test_an_answer_on_another_route_leaves_the_failing_route_alarmed(): void
    {
        $host = $this->journal->enrolledHost();
        $this->journal->hostCall($host, 'POST', self::FAILING_ROUTE)->assertServerError();
        $this->travel(2)->minutes();

        $this->journal->hostCall($host, 'POST', self::ANSWERED_ROUTE)->assertSuccessful();

        $this->assertCount(1, $this->app->make(HostLinkAlarms::class)->current());
    }

    public function test_a_failure_shorter_than_a_minute_raises_no_alarm(): void
    {
        $host = $this->journal->enrolledHost();

        $this->journal->hostCall($host, 'POST', self::FAILING_ROUTE)->assertServerError();

        $this->assertSame([], $this->app->make(HostLinkAlarms::class)->current());
    }

    public function test_a_claim_the_journal_stopped_before_answering_raises_the_alarm_when_the_host_reports_it(): void
    {
        $host = $this->journal->enrolledHost();
        $since = CarbonImmutable::now()->toIso8601String();
        $reported = [['route' => '/host/orders/claim', 'status' => 500, 'reason' => self::REASON, 'since' => $since]];

        $this->journal->hostCall(
            $host,
            'POST',
            self::FAILING_ROUTE_ANSWERED,
            '{}',
            headers: ['HTTP_X_JOURNAL_FAILED_CALLS' => json_encode($reported, JSON_THROW_ON_ERROR)],
        )->assertSuccessful();
        $this->travel(2)->minutes();

        $alarms = $this->app->make(HostLinkAlarms::class)->current();
        $this->assertSame([Host::query()->findOrFail($host->hostId)->link_alarm], $alarms);
        $this->assertStringContainsString('/host/orders/claim', $alarms[0]);
        $this->assertStringContainsString(self::REASON, $alarms[0]);
    }

    public function test_the_calls_a_host_reports_failed_on_its_side_are_kept_with_it(): void
    {
        $host = $this->journal->enrolledHost();
        $reported = [
            [
                'route' => '/host/orders/claim',
                'status' => 0,
                'reason' => 'connection refused',
                'since' => '2026-11-24T10:00:00Z',
            ],
        ];

        $this->journal->hostCall(
            $host,
            'POST',
            self::ANSWERED_ROUTE,
            '{}',
            headers: ['HTTP_X_JOURNAL_FAILED_CALLS' => json_encode($reported, JSON_THROW_ON_ERROR)],
        )->assertSuccessful();

        $this->assertEquals($reported, Host::query()->findOrFail($host->hostId)->reported_failures?->toArray());
    }
}
