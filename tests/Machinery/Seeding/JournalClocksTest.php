<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Contracts\Time\ServerClock;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The server clock, what commands read, and Carbon, what now() gives, move apart: moving one leaves the other.
 */
final class JournalClocksTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_moving_the_server_clock_leaves_carbon_and_the_reverse(): void
    {
        $start = CarbonImmutable::parse('2026-01-01 09:00:00');
        $carbon = CarbonImmutable::now();

        $this->journal->useServerClockAt($start)->moveServerClockTo($start->addHour());

        $this->assertEquals($start->addHour(), $this->app->make(ServerClock::class)->now());
        $this->assertEqualsWithDelta($carbon->getTimestamp(), CarbonImmutable::now()->getTimestamp(), 5);

        $this->journal->travelTo($start->addYear());

        $this->assertEquals($start->addYear(), CarbonImmutable::now());
        $this->assertEquals($start->addHour(), $this->app->make(ServerClock::class)->now());
    }

    public function test_fixed_random_strings_are_the_given_text(): void
    {
        $this->journal->fixRandomStrings('the-key');

        $this->journal->assertResult(['the-key', 'the-key'], [Str::random(64), Str::random()]);
    }
}
