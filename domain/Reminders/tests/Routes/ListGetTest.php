<?php

declare(strict_types=1);

namespace Domain\Reminders\Tests\Routes;

use App\Web\Creation\WindowFactory;
use Domain\Reminders\Data\RemindersPaneData;
use Domain\Reminders\Http\Windows\RemindersWindowBuilder;
use Domain\Reminders\RemindersDomain;
use Illuminate\Http\Request;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens their reminders.
 */
#[TestsRoute('GET', 'reminders.list')]
final class ListGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_pane_builds_compact_rows_and_a_full_link(): void
    {
        $this->journal->owner();
        $factory = new WindowFactory($this->app);
        $factory->register(RemindersPaneData::class, RemindersWindowBuilder::class);

        $pane = $factory->create(RemindersPaneData::class, Request::create('/?page=2'));

        $this->assertSame([], $pane->items);
        $this->assertSame('/reminders?page=2', $pane->fullUrl);
    }

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RemindersDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
