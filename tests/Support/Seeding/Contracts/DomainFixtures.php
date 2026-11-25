<?php

declare(strict_types=1);

namespace Tests\Support\Seeding\Contracts;

use Tests\Support\Seeding\FixtureRegistration;

/**
 * A domain's Tests\Fixtures\Fixtures class: it names the fixture builders the domain offers the journal fixture.
 */
interface DomainFixtures
{
    public static function register(FixtureRegistration $registration): void;
}
