<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Core\Bus\Contracts\CommandBus;
use App\Core\Bus\Exceptions\CommandRefused;
use App\Core\Bus\Exceptions\CommandTransactionMismatch;
use App\Core\Bus\Exceptions\ExplicitTransactionInCommand;
use App\Core\Bus\Exceptions\NestedCommandFailureIgnored;
use App\Core\Hooks\Support\StackTransaction;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Commands\CopyNote;
use Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote;
use Tests\Fixtures\Modules\Notes\Commands\OpenTransactionNote;
use Tests\Fixtures\Modules\Notes\Commands\PinNote;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;

/**
 * One transaction per command (doc 19, Book D): it commits in the command's isolation, a nested command joins it, a
 * refusal or an ignored inner failure rolls everything back, a handler may not open its own, and a stack transaction
 * is joined only at the same isolation.
 */
final class CommandTransactionTest extends CommandBusTestCase
{
    public function test_a_command_commits_in_its_isolation_and_a_repeatable_read_command_gets_its_own(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(1);
        $bus = $this->app->make(CommandBus::class);

        $id = $bus->run(new WriteNote('kept'));

        $this->assertSame('kept', $this->rowText($id));
        $this->assertSame('repeatable read', $bus->run(new PinNote($id)));
        $this->assertSame(0, $this->app->make(ConnectionInterface::class)->transactionLevel());
    }

    public function test_a_command_dispatched_by_a_handler_joins_the_open_transaction(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(1);

        $id = $this->app->make(CommandBus::class)->run(new CopyNote('copied'));

        $this->assertSame('copied', $this->rowText($id));
    }

    public function test_a_refusal_rolls_back_everything_the_command_wrote(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(1);

        try {
            $this->app->make(CommandBus::class)->run(new RefuseNote('gone'));
            $this->fail('The refusal did not reach the caller.');
        } catch (CommandRefused) {
            $this->assertSame(0, $this->rowCount());
        }
    }

    public function test_a_handler_that_ignores_a_failed_inner_command_fails_the_whole_command(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(1);

        try {
            $this->app->make(CommandBus::class)->run(new IgnoreFailedNote('half'));
            $this->fail('The ignored failure was let through.');
        } catch (NestedCommandFailureIgnored) {
            $this->assertSame(0, $this->rowCount());
        }
    }

    public function test_a_transaction_a_handler_opens_itself_is_refused_and_nothing_is_left_open(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(1);

        try {
            $this->app->make(CommandBus::class)->run(new OpenTransactionNote('own'));
            $this->fail('The explicit transaction was let through.');
        } catch (ExplicitTransactionInCommand) {
            $this->assertSame(0, $this->app->make(ConnectionInterface::class)->transactionLevel());
            $this->assertSame(0, $this->rowCount());
        }
    }

    public function test_a_command_joins_a_stack_transaction_of_its_isolation_and_refuses_another(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(1);
        $bus = $this->app->make(CommandBus::class);

        $id = $this->app->make(StackTransaction::class)->run(fn () => $bus->run(new WriteNote('joined')));
        $this->assertSame('joined', $this->rowText($id));

        $this->expectException(CommandTransactionMismatch::class);
        $this->app->make(StackTransaction::class)->run(fn () => $bus->run(new PinNote($id)));
    }
}
