<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Support\DomainEntry;
use Closure;

/**
 * One booted domain registering its fixture builders: each is kept under the domain that owns it.
 */
final readonly class FixtureRegistration
{
    public function __construct(private DomainEntry $owner, private FixtureRegistry $registry) {}

    /**
     * @param  class-string  $fixtures
     * @param  Closure(JournalSeed): object  $maker
     */
    public function register(string $fixtures, Closure $maker): void
    {
        $this->registry->register($this->owner, $fixtures, $maker);
    }
}
