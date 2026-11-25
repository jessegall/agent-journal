<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Fixtures;

use Tests\Support\Seeding\Contracts\DomainFixtures;
use Tests\Support\Seeding\FixtureRegistration;
use Tests\Support\Seeding\JournalSeed;

/**
 * The fixture builders the Sharing domain offers the journal fixture.
 */
final class Fixtures implements DomainFixtures
{
    public static function register(FixtureRegistration $registration): void
    {
        $registration->register(ShareFixtures::class, fn (JournalSeed $journal) => new ShareFixtures($journal));
    }
}
