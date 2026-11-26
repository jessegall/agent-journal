<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Accounts\Enums\CommandEntry;
use App\Actors\Contracts\CurrentActor;
use App\Agents\Commands\CreateAgent\CreateAgentCommand;
use App\Bus\Exceptions\CommandInputInvalid;
use App\Bus\RequestKey;
use App\Inboxes\Commands\InstallInboxes\InstallInboxesCommand;
use App\Models\Inboxes\Inbox;
use App\Models\Records\Layout;
use App\Terminals\Commands\SaveLayout\SaveLayoutCommand;
use App\Terminals\Data\LayoutShape;
use LogicException;
use PHPUnit\Framework\AssertionFailedError;
use RuntimeException;
use Tests\Commands\Layouts\SaveLayoutTest;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;
use Throwable;

/**
 * The journal sends a command as the actor in place, keyed or not, or as the journal through a trusted entry, and
 * asserts the result or refusal it gave.
 */
#[TestsMachinery(TestJournal::class)]
final class JournalCommandsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_same_key_twice_gives_the_first_answer_and_one_layout(): void
    {
        $this->journal->owner();
        $command = new SaveLayoutCommand('Writing', LayoutShape::from(SaveLayoutTest::shape('chat')));

        $first = $this->journal->run($command, 'key-1');
        $again = $this->journal->run($command, 'key-1');

        $this->journal->assertResult($first, $again);
        $this->assertSame(1, Layout::query()->count());
    }

    public function test_a_refused_command_and_an_unkeyed_one_leave_no_key_behind(): void
    {
        $this->journal->owner();

        $this->journal->assertRefused(
            CommandInputInvalid::class,
            fn () => $this->journal->run(new CreateAgentCommand('   ', 'writing-helper', $this->localProject()->id)),
        );
        $this->journal->runUnkeyed(new SaveLayoutCommand('Writing', LayoutShape::from(SaveLayoutTest::shape('chat'))));

        $this->assertNull($this->app->make(RequestKey::class)->key());
    }

    public function test_keyed_work_runs_under_one_key_and_leaves_none_behind(): void
    {
        $this->journal->owner();
        $key = $this->app->make(RequestKey::class);

        $during = $this->journal->keyed(fn () => $key->key());

        $this->assertNotNull($during);
        $this->assertNull($key->key());
    }

    public function test_a_journal_command_runs_from_its_entry_and_the_owner_acts_again_after_it(): void
    {
        $this->journal->owner();

        $this->journal->runAsJournal(CommandEntry::HostControl, 'inbox install', new InstallInboxesCommand());

        $this->assertTrue(Inbox::findMain()->exists);
        $this->assertSame($this->journal->ownerUser()->id, $this->app->make(CurrentActor::class)->actor()->id);
    }

    public function test_a_trusted_command_runs_through_its_own_entry_as_the_system(): void
    {
        $this->journal->owner();

        $this->journal->throughEntry(new InstallInboxesCommand());

        $this->assertTrue(Inbox::findMain()->exists);
        $this->assertSame($this->journal->ownerUser()->id, $this->app->make(CurrentActor::class)->actor()->id);
    }

    public function test_a_journal_command_from_the_wrong_entry_is_refused(): void
    {
        $this->journal->owner();

        $this->assertThrows(
            fn () => $this->journal->runAsJournal(
                CommandEntry::ShareGateway,
                'inbox install',
                new InstallInboxesCommand(),
            ),
        );
    }

    public function test_a_refusal_reaches_its_verifier_once_and_another_failure_passes_on(): void
    {
        $runs = 0;
        $seen = null;

        $this->journal->assertRefused(LogicException::class, function () use (&$runs): void {
            $runs++;

            throw new LogicException('refused');
        }, function (LogicException $refusal) use (&$seen): void {
            $seen = $refusal->getMessage();
        });

        $this->assertSame([1, 'refused'], [$runs, $seen]);
        $cause = new RuntimeException('cause');
        $this->assertThrows(
            fn () => $this->journal->assertRefused(LogicException::class, fn () => throw $cause),
            RuntimeException::class,
            'cause',
        );
    }

    public function test_an_act_that_is_not_refused_fails(): void
    {
        $this->expectException(AssertionFailedError::class);

        $this->journal->assertRefused(Throwable::class, fn () => null);
    }
}
