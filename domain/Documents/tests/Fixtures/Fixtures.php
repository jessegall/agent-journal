<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Fixtures;

use Tests\Support\Seeding\Contracts\DomainFixtures;
use Tests\Support\Seeding\FixtureRegistration;
use Tests\Support\Seeding\TestJournal;

/**
 * The fixture builders the Documents domain offers the journal fixture.
 */
final class Fixtures implements DomainFixtures
{
    public static function register(FixtureRegistration $registration): void
    {
        $registration->register(DocumentFixtures::class, fn (TestJournal $journal) => new DocumentFixtures($journal));
    }
}
