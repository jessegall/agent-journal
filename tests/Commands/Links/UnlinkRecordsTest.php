<?php

declare(strict_types=1);

namespace Tests\Commands\Links;

use App\Commands\Links\LinkRecords\LinkRecordsCommand;
use App\Commands\Links\UnlinkRecords\UnlinkRecordsCommand;
use App\Models\Records\Link;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * A reader takes away the link between two records, named either way round, and both records stay.
 */
final class UnlinkRecordsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['links', 'tasks'];

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_the_link_goes_whichever_way_round_it_is_named_and_both_records_stay(): void
    {
        $this->journal->owner();
        $first = Task::create('First', 'One.', $this->journal->ownerUser())->assignmentIdentity();
        $second = Task::create('Second', 'Two.', $this->journal->ownerUser())->assignmentIdentity();
        $this->journal->run(new LinkRecordsCommand($first, $second));

        $this->journal->run(new UnlinkRecordsCommand($second, $first));

        $this->assertSame([0, 2], [Link::query()->count(), Task::query()->count()]);
    }
}
