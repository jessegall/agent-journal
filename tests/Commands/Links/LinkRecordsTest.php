<?php

declare(strict_types=1);

namespace Tests\Commands\Links;

use App\Commands\Links\LinkRecords\LinkRecordsCommand;
use App\Exceptions\RecordUnavailable;
use App\Models\Records\Link;
use App\Support\RecordIdentity;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * A reader links one record to another once, whichever way round it is named again; a record that is not there is
 * refused and links nothing.
 */
final class LinkRecordsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['links', 'tasks'];

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_two_records_are_linked_once_whichever_way_round(): void
    {
        $this->journal->owner();
        $first = Task::create('First', 'One.', $this->journal->ownerUser())->assignmentIdentity();
        $second = Task::create('Second', 'Two.', $this->journal->ownerUser())->assignmentIdentity();

        $this->journal->run(new LinkRecordsCommand($first, $second));
        $this->journal->run(new LinkRecordsCommand($second, $first));

        $this->assertSame(1, Link::query()->count());
    }

    public function test_a_record_that_is_not_there_is_refused_and_links_nothing(): void
    {
        $this->journal->owner();
        $first = Task::create('First', 'One.', $this->journal->ownerUser())->assignmentIdentity();

        $this->assertThrows(
            fn () => $this->journal->run(
                new LinkRecordsCommand($first, new RecordIdentity($first->type, '01jd8x0g9m3qz6v4k2t7r00000')),
            ),
            RecordUnavailable::class,
        );
        $this->assertSame(0, Link::query()->count());
    }
}
