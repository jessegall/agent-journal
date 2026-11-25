<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Fixtures;

use Tests\Support\Seeding\Contracts\DomainFixtures;
use Tests\Support\Seeding\FixtureRegistration;
use Tests\Support\Seeding\JournalSeed;

/**
 * The fixture builders the Tasks domain offers the journal fixture.
 */
final class Fixtures implements DomainFixtures
{
    public static function register(FixtureRegistration $registration): void
    {
        $registration->register(TaskFixtures::class, fn (JournalSeed $journal) => new TaskFixtures($journal));
    }
}
