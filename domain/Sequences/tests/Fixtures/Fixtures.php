<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Fixtures;

use Tests\Support\Seeding\Contracts\DomainFixtures;
use Tests\Support\Seeding\FixtureRegistration;
use Tests\Support\Seeding\JournalSeed;

/**
 * The fixture builders the Sequences domain offers the journal fixture.
 */
final class Fixtures implements DomainFixtures
{
    public static function register(FixtureRegistration $registration): void
    {
        $registration->register(SequenceFixtures::class, fn (JournalSeed $journal) => new SequenceFixtures($journal));
    }
}
