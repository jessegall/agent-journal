<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Routes;

use Domain\Memory\Commands\EditMemory\EditMemoryCommand;
use Domain\Memory\MemoryDomain;
use Domain\Memory\Tests\Fixtures\MemoryFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent changes the weight of one of its memories at the revision it read.
 */
#[TestsRoute('POST', 'memory.edit')]
final class EditPostTest extends GuardedRouteEntryTestCase
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
            ->payload([
                'memory_id' => $memory->id,
                'revision' => 1,
                'text' => null,
                'weight' => 9,
                'request_key' => 'write-1',
            ])
            ->reply(EditMemoryCommand::class, $memory->id)
            ->expects(EditMemoryCommand::class, [
                'memoryId' => $memory->id,
                'expectedRevision' => 1,
                'weight' => 9,
            ]);
    }
}
