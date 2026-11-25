<?php

declare(strict_types=1);

namespace Tests\Feature\Seeding;

use App\Commands\Links\LinkRecords\LinkRecordsCommand;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * The journal asserts links by their two records either way round: a link made twice, once the other way, is one, and
 * a link to a third record is left alone.
 */
final class JournalLinksTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['links', 'tasks'];

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_a_link_made_twice_either_way_is_one_and_another_stays(): void
    {
        $this->journal->owner();
        $first = Task::create('First', 'One.', $this->journal->ownerUser());
        $second = Task::create('Second', 'Two.', $this->journal->ownerUser());
        $third = Task::create('Third', 'Three.', $this->journal->ownerUser());

        $this->journal->run(new LinkRecordsCommand($first->assignmentIdentity(), $second->assignmentIdentity()));
        $this->journal->run(new LinkRecordsCommand($second->assignmentIdentity(), $first->assignmentIdentity()));
        $this->journal->run(new LinkRecordsCommand($first->assignmentIdentity(), $third->assignmentIdentity()));

        $this->journal->assertLinked($second, $first)->assertLinked($first, $third)->assertLinkCount(2, $first);
        $this->journal->assertUnlinked($second, $third);
    }
}
