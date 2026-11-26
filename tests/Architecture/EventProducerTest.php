<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\CommandRegistry;
use Tests\Architecture\Support\CommandReach;
use Tests\Architecture\Support\EventProducers;
use Tests\Architecture\Support\EventRole;
use Tests\Fixtures\EventProducers\Events\FixtureChanged;
use Tests\Fixtures\EventProducers\Events\FixtureFinished;
use Tests\Fixtures\EventProducers\Events\FixtureHeld;
use Tests\Fixtures\EventProducers\Models\FixtureTask;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A migrated event has one producer, its model: every send of an event is the raise of its owning model method or a
 * producer its area's list in tests/Architecture/EventOwners names, so a new, moved or duplicate send fails. A migrated
 * fact carries a payload a queue can hold.
 */
#[TimeLimit(seconds: 30, reason: 'It parses every PHP file of app and the domains.')]
final class EventProducerTest extends TestCase
{
    private const string HOW_TO_FIX = "Send each event only from its expected producer (%s):\n";

    /**
     * The guideline a failure points to.
     */
    private const string GUIDELINE = '.ai/guidelines/models-raise-their-events.md';

    /**
     * The file that releases migrated facts after the commit, the one place allowed to send them; a fact with no row
     * to raise on goes in through EventUnitLifecycle::publishAfterCommit, which counts as its producer's send.
     */
    private const string BUS_PUBLISHER = 'app/Bus/Publication.php';

    private const string FIXTURES = 'tests/Fixtures/EventProducers';

    public function test_every_event_is_sent_only_by_its_expected_producers(): void
    {
        $expected = EventProducers::expected(base_path());
        $reach = CommandReach::of($this->app->make(CommandRegistry::class), base_path(), $this->app);
        $violations = EventProducers::across(base_path(), $expected, $reach->handlersByFile)
            ->violations($expected, self::BUS_PUBLISHER);

        $this->assertSame(
            [],
            $violations,
            sprintf(self::HOW_TO_FIX, self::GUIDELINE).implode("\n", $violations),
        );
    }

    public function test_the_fixtures_break_the_expected_producers_where_they_should(): void
    {
        $expected = [
            FixtureFinished::class => [
                'role' => EventRole::RowFact,
                'owner' => 'FixtureTask::finish',
                'migrated' => true,
                'producers' => [],
                'sample' => fn () => new FixtureFinished('task'),
            ],
            FixtureHeld::class => [
                'role' => EventRole::RowFact,
                'owner' => 'FixtureTask::hold',
                'migrated' => true,
                'producers' => [],
                'sample' => fn () => new FixtureHeld(new FixtureTask()),
            ],
            FixtureChanged::class => [
                'role' => EventRole::CommandFact,
                'migrated' => false,
                'producers' => [self::FIXTURES.'/Senders/Forwarder.php'],
            ],
        ];

        $violations = EventProducers::in(base_path(), [base_path(self::FIXTURES)], $expected)
            ->violations($expected, self::BUS_PUBLISHER);

        $this->assertSame([
            self::FIXTURES.'/Handlers/FinishFixtureHandler.php:21 FinishFixtureHandler::handle sends FixtureFinished '
                .'through ->dispatch(), a migrated fact: only FixtureTask::finish raises it, and the bus releases it',
            self::FIXTURES.'/Models/FixtureTask.php:43 FixtureTask::announce sends FixtureChanged through '
                .'->dispatch(): only '.self::FIXTURES.'/Senders/Forwarder.php send it',
            self::FIXTURES.'/Senders/OtherSenders.php:20 OtherSenders::byFacadeAlias sends FixtureChanged through '
                .'Event::dispatch(): only '.self::FIXTURES.'/Senders/Forwarder.php send it',
            self::FIXTURES.'/Senders/OtherSenders.php:26 OtherSenders::byVariable sends FixtureChanged through '
                .'->dispatch(): only '.self::FIXTURES.'/Senders/Forwarder.php send it',
            self::FIXTURES.'/Senders/OtherSenders.php:31 OtherSenders::byFactory sends FixtureChanged through '
                .'->dispatch(): only '.self::FIXTURES.'/Senders/Forwarder.php send it',
            'FixtureHeld: its property $task holds a '.FixtureTask::class.', which a queued fact cannot carry',
        ], $violations);
    }
}
