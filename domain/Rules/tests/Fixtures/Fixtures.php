<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Fixtures;

use Tests\Support\Seeding\Contracts\DomainFixtures;
use Tests\Support\Seeding\FixtureRegistration;
use Tests\Support\Seeding\JournalSeed;

/**
 * The fixture builders the Rules domain offers the journal fixture.
 */
final class Fixtures implements DomainFixtures
{
    public static function register(FixtureRegistration $registration): void
    {
        $registration->register(RuleFixtures::class, fn (JournalSeed $journal) => new RuleFixtures($journal));
    }
}
