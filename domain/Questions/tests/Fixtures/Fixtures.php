<?php

declare(strict_types=1);

namespace Domain\Questions\Tests\Fixtures;

use Tests\Support\Seeding\Contracts\DomainFixtures;
use Tests\Support\Seeding\FixtureRegistration;
use Tests\Support\Seeding\JournalSeed;

/**
 * The fixture builders the Questions domain offers the journal fixture.
 */
final class Fixtures implements DomainFixtures
{
    public static function register(FixtureRegistration $registration): void
    {
        $registration->register(QuestionFixtures::class, fn (JournalSeed $journal) => new QuestionFixtures($journal));
    }
}
