<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Routes;

use Domain\Memory\Commands\RemoveMemory\RemoveMemoryCommand;
use Domain\Memory\MemoryDomain;
use Domain\Memory\Tests\Fixtures\MemoryFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent removes one of its memories.
 */
#[TestsRoute('POST', 'memory.remove')]
final class RemovePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Builder');

        $memory = $journal->fixtures(MemoryFixtures::class)
            ->createMemory('Rule', 'Builder', 'Run the phase tests once.');

        return RouteCall::as(Caller::Agent, $start)
            ->payload(['memory_id' => $memory->id, 'request_key' => 'write-1'])
            ->reply(RemoveMemoryCommand::class, $memory->id)
            ->expects(RemoveMemoryCommand::class, ['memoryId' => $memory->id]);
    }
}
