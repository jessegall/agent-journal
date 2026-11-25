<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Support\Domain;

/**
 * What a start scenario needs in place before it writes: the domains it uses, the users and agents it takes by name,
 * the agents among them it acts as through their one session, and whether it makes the journal's owner.
 */
final readonly class ScenarioRequirements
{
    /**
     * @param  list<class-string<Domain>>  $domains
     * @param  list<string>  $names
     * @param  list<string>  $sessions
     */
    public function __construct(
        public array $domains = [],
        public array $names = [],
        public array $sessions = [],
        public bool $makesOwner = false,
    ) {}
}
