<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Routes;

use Domain\Memory\Commands\SaveMemory\SaveMemoryCommand;
use Domain\Memory\MemoryDomain;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent saves a memory with its weight.
 */
#[TestsRoute('POST', 'memory.save')]
final class SavePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Builder');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'text' => 'Run the phase tests once.',
                'weight' => 7,
                'request_key' => 'write-1',
            ])
            ->reply(SaveMemoryCommand::class, Str::ulid())
            ->expects(SaveMemoryCommand::class, [
                'text' => 'Run the phase tests once.',
                'weight' => 7,
            ]);
    }
}
