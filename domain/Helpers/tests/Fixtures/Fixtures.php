<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Fixtures;

use Tests\Support\Seeding\Contracts\DomainFixtures;
use Tests\Support\Seeding\FixtureRegistration;
use Tests\Support\Seeding\TestJournal;

/**
 * The fixture builders the Helpers domain offers the journal fixture.
 */
final class Fixtures implements DomainFixtures
{
    public static function register(FixtureRegistration $registration): void
    {
        $registration->register(HelperFixtures::class, fn (TestJournal $journal) => new HelperFixtures($journal));
    }
}
