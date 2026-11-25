<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Fixtures;

use Tests\Support\Seeding\Contracts\DomainFixtures;
use Tests\Support\Seeding\FixtureRegistration;
use Tests\Support\Seeding\TestJournal;

/**
 * The fixture builders the Memory domain offers the journal fixture.
 */
final class Fixtures implements DomainFixtures
{
    public static function register(FixtureRegistration $registration): void
    {
        $registration->register(MemoryFixtures::class, fn (TestJournal $journal) => new MemoryFixtures($journal));
    }
}
