<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Commands\Links\LinkRecords\LinkRecordsCommand;
use App\Commands\Links\UnlinkRecords\UnlinkRecordsCommand;
use App\Events\Links\LinkEvent;
use App\Events\Links\LinkRemoved;
use App\Models\Records\Link;
use App\Support\RecordIdentity;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Database\DatabaseManager;
use PHPUnit\Framework\AssertionFailedError;
use RuntimeException;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\TestProjects;
use Tests\TestCase;

/**
 * The journal's event window opens after the arrangement, sees each event once by its own type or its group's, lets
 * the listeners run and counts nothing that a rollback took back.
 */
final class JournalEventsTest extends TestCase
{
    use CommitsHookRows;

    protected const array TABLES = ['links', 'tasks'];

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_an_unlink_after_the_window_opens_is_counted_by_its_type_and_by_its_group(): void
    {
        [$first, $second] = $this->linkedTasks();
        $this->journal->observeEvents(LinkEvent::class, LinkRemoved::class);

        $this->journal->run(new UnlinkRecordsCommand($second, $first));

        // The group hears the link's own removal and the batch that announces it after the commit.
        $this->journal->assertEventCount(LinkRemoved::class, 1)->assertEventCount(LinkEvent::class, 2);
        $this->assertSame(0, Link::query()->count());
    }

    public function test_an_event_is_counted_by_type_and_by_what_the_predicate_accepts(): void
    {
        [$first, $second] = $this->linkedTasks();
        $this->journal->observeEvents(LinkRemoved::class);

        $this->journal->run(new UnlinkRecordsCommand($second, $first));

        $this->journal->assertEvent(LinkRemoved::class)
            ->assertEvent(
                LinkRemoved::class,
                fn (LinkRemoved $removed) => $removed->linkId === 'another link',
                count: 0,
            );
        $this->assertThrows(
            fn () => $this->journal->assertEvent(LinkRemoved::class, count: 2),
            AssertionFailedError::class,
        );
    }

    public function test_an_unlink_rolled_back_is_not_seen_and_a_later_one_is(): void
    {
        [$first, $second] = $this->linkedTasks();
        $this->journal->observeEvents(LinkRemoved::class);

        $database = $this->app->make(DatabaseManager::class);
        $rolledBack = fn () => $database->transaction(function () use ($first, $second): void {
            $this->journal->run(new UnlinkRecordsCommand($second, $first));

            throw new RuntimeException('rolled back');
        });

        $this->assertThrows($rolledBack, RuntimeException::class);

        $this->journal->assertEventCount(LinkRemoved::class, 0);
        $this->journal->run(new UnlinkRecordsCommand($second, $first));
        $this->journal->assertEventCount(LinkRemoved::class, 1);
    }

    /**
     * @return array{RecordIdentity, RecordIdentity}
     */
    private function linkedTasks(): array
    {
        $this->journal->owner();
        $first = Task::create(
            'First',
            'One.',
            $this->journal->ownerUser(),
            TestProjects::ownerOf($this->journal->ownerUser()),
        )->assignmentIdentity();
        $second = Task::create(
            'Second',
            'Two.',
            $this->journal->ownerUser(),
            TestProjects::ownerOf($this->journal->ownerUser()),
        )->assignmentIdentity();
        $this->journal->run(new LinkRecordsCommand($first, $second));

        return [$first, $second];
    }
}
