<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Routes;

use Domain\Memory\MemoryDomain;
use Domain\Memory\Tests\Fixtures\MemoryFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent lists its memories.
 */
#[TestsRoute('POST', 'memory.list')]
final class ListPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Builder');
        $journal->fixtures(MemoryFixtures::class)->memory('Rule', 'Builder', 'Run the phase tests once.');

        return RouteCall::as(Caller::Agent, $start);
    }

    public function test_an_agent_lists_only_its_own_memories(): void
    {
        $call = $this->arrangedCall();
        $other = $this->journal->signedStart('Other reader');
        $this->journal->heartbeatOf($other);

        $this->send(RouteCall::as(Caller::Agent, $other), Caller::Agent)->assertOk()->assertJsonPath('memories', []);
        $this->send($call, Caller::Agent)->assertOk()->assertJsonCount(1, 'memories');
    }
}
