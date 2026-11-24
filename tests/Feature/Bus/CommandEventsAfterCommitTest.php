<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Contracts\Bus\CommandBus;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Commands\AuditNote\AuditNoteCommand;
use Tests\Fixtures\Modules\Notes\Events\NoteAudited;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;

/**
 * A fact dispatched anywhere inside a command, even with a plain dispatch from its handler,
 * is heard only once the command's transaction commits, and never when it rolls back.
 */
final class CommandEventsAfterCommitTest extends CommandBusTestCase
{
    /**
     * The transaction level each hearing of the audit happened at.
     *
     * @var list<int>
     */
    private array $heardAt = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->installCommandModules();
        $this->startTestUserRequest(1);
        $database = $this->app->make(ConnectionInterface::class);
        $this->app->make(Dispatcher::class)->listen(
            NoteAudited::class,
            function () use ($database): void {
                $this->heardAt[] = $database->transactionLevel();
            },
        );
    }

    public function test_a_plain_dispatch_inside_a_committed_command_is_heard_after_the_commit(): void
    {
        $levelOutside = $this->app->make(ConnectionInterface::class)->transactionLevel();

        $this->app->make(CommandBus::class)->run(new AuditNoteCommand('heard'));

        $this->assertSame([$levelOutside], $this->heardAt);
        $this->assertSame(1, $this->rowCount());
    }

    public function test_a_plain_dispatch_inside_a_rolled_back_command_is_never_heard(): void
    {
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new AuditNoteCommand('dropped', fails: true)),
            NoteWorkFailed::class,
        );

        $this->assertSame([], $this->heardAt);
        $this->assertSame(0, $this->rowCount());
    }

    public function test_a_dispatch_outside_any_command_is_heard_at_once(): void
    {
        $this->app->make(Dispatcher::class)->dispatch(new NoteAudited());

        $this->assertCount(1, $this->heardAt);
    }
}
