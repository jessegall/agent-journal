<?php

declare(strict_types=1);

namespace Domain\Comments\Tests\Fixtures;

use Tests\Support\Seeding\Contracts\DomainFixtures;
use Tests\Support\Seeding\FixtureRegistration;
use Tests\Support\Seeding\TestJournal;

/**
 * The fixture builders the Comments domain offers the journal fixture.
 */
final class Fixtures implements DomainFixtures
{
    public static function register(FixtureRegistration $registration): void
    {
        $registration->register(CommentFixtures::class, fn (TestJournal $journal) => new CommentFixtures($journal));
    }
}
