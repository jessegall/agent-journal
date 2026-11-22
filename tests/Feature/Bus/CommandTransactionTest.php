<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\CommandRefused;
use App\Exceptions\CommandTransactionMismatch;
use App\Exceptions\ExplicitTransactionInCommand;
use App\Exceptions\NestedCommandFailureIgnored;
use App\Support\StackTransaction;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Commands\CopyNote\CopyNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote\IgnoreFailedNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\OpenTransactionNote\OpenTransactionNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\PinNote\PinNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote\RefuseNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;

/**
 * One transaction per command (doc 19, Book D): it commits in the command's isolation, a nested command joins it, a
 * refusal or an ignored inner failure rolls everything back, a handler may not open its own, and a stack transaction
 * is joined only at the same isolation.
 */
final class CommandTransactionTest extends CommandBusTestCase
{
    private const string ISOLATION = 'repeatable read';

    public function test_a_command_commits_in_its_isolation_and_a_repeatable_read_command_gets_its_own(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);
        $bus = $this->app->make(CommandBus::class);

        $id = $bus->run(new WriteNoteCommand('kept'));

        $this->assertSame('kept', $this->rowText($id));
        $this->assertSame(self::ISOLATION, $bus->run(new PinNoteCommand($id)));
        $this->assertSame(0, $this->app->make(ConnectionInterface::class)->transactionLevel());
    }

    public function test_a_command_dispatched_by_a_handler_joins_the_open_transaction(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);

        $id = $this->app->make(CommandBus::class)->run(new CopyNoteCommand('copied'));

        $this->assertSame('copied', $this->rowText($id));
    }

    public function test_a_refusal_rolls_back_everything_the_command_wrote(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);

        try {
            $this->app->make(CommandBus::class)->run(new RefuseNoteCommand('gone'));
            $this->fail('The refusal did not reach the caller.');
        } catch (CommandRefused) {
            $this->assertSame(0, $this->rowCount());
        }
    }

    public function test_a_handler_that_ignores_a_failed_inner_command_fails_the_whole_command(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);

        try {
            $this->app->make(CommandBus::class)->run(new IgnoreFailedNoteCommand('half'));
            $this->fail('The ignored failure was let through.');
        } catch (NestedCommandFailureIgnored) {
            $this->assertSame(0, $this->rowCount());
        }
    }

    public function test_a_transaction_a_handler_opens_itself_is_refused_and_nothing_is_left_open(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);

        try {
            $this->app->make(CommandBus::class)->run(new OpenTransactionNoteCommand('own'));
            $this->fail('The explicit transaction was let through.');
        } catch (ExplicitTransactionInCommand) {
            $this->assertSame(0, $this->app->make(ConnectionInterface::class)->transactionLevel());
            $this->assertSame(0, $this->rowCount());
        }
    }

    public function test_a_command_joins_a_stack_transaction_of_its_isolation_and_refuses_another(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);
        $bus = $this->app->make(CommandBus::class);

        $id = $this->app->make(StackTransaction::class)->run(fn () => $bus->run(new WriteNoteCommand('joined')));
        $this->assertSame('joined', $this->rowText($id));

        $this->expectException(CommandTransactionMismatch::class);
        $this->app->make(StackTransaction::class)->run(fn () => $bus->run(new PinNoteCommand($id)));
    }
}
