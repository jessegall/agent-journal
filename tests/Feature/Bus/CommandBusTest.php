<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Exceptions\UserActorRequired;
use App\Core\Bus\Contracts\CommandBus;
use App\Core\Bus\Exceptions\CommandNestingTooDeep;
use App\Core\Bus\Exceptions\CommandNotRegistered;
use App\Core\Bus\Exceptions\CommandRefused;
use App\Core\Bus\Exceptions\CommandReplacementRefused;
use App\Core\Bus\Exceptions\CommandResultChanged;
use App\Core\Bus\Exceptions\CommandTransactionMismatch;
use App\Core\Bus\Exceptions\ContinuationCalledTwice;
use App\Core\Bus\Exceptions\ExplicitTransactionInCommand;
use App\Core\Bus\Exceptions\MiddlewareSkippedCommand;
use App\Core\Bus\Exceptions\MiddlewareSwallowedFailure;
use App\Core\Bus\Exceptions\NestedCommandFailureIgnored;
use App\Core\Bus\Support\CommandNesting;
use App\Core\Bus\Support\CommandScope;
use App\Core\Bus\Support\LaravelCommandBus;
use App\Core\Bus\Support\MiddlewareDeclaration;
use App\Core\Hooks\Support\StackTransaction;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Bus\Shop\Commands\AddItem;
use Tests\Fixtures\Bus\Shop\Enums\ItemSize;
use Tests\Fixtures\Modules\Cards\Commands\DrawCard;
use Tests\Fixtures\Modules\Cards\Commands\ShuffleDeck;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\CallsNextTwice;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\ChangesResult;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RefusesAll;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\ReplacesCardsCommand;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\SkipsCommand;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\SwallowsFailure;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\UppercasesText;
use Tests\Fixtures\Modules\Notes\Commands\ClearNotes;
use Tests\Fixtures\Modules\Notes\Commands\CopyNote;
use Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote;
use Tests\Fixtures\Modules\Notes\Commands\OpenTransactionNote;
use Tests\Fixtures\Modules\Notes\Commands\PinNote;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote;
use Tests\Fixtures\Modules\Notes\Commands\UserNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;
use Tests\Support\InstallsCommandModules;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * The command bus end to end on the Cards and Notes test modules (doc 19, phase 1): dispatching and results, the
 * actor check and the log line, opening, joining and refusing transactions, module middleware in order and held to
 * its contract, refusals rendered for web and agent routes, and a fresh bus for each request.
 */
final class CommandBusTest extends TestCase
{
    use InstallsCommandModules;
    use RefreshHookDatabase;
    use StartsAgentRequests;

    protected function tearDown(): void
    {
        $this->app->make(ConnectionInterface::class)->table('module_command_rows')->delete();

        parent::tearDown();
    }

    public function test_every_registered_command_has_its_handler_and_its_result_comes_back_unchanged(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(1);
        $bus = $this->app->make(CommandBus::class);

        $this->assertInstanceOf(LaravelCommandBus::class, $bus);
        $this->assertTrue($bus->hasHandlerFor(new DrawCard('red')));
        $this->assertSame('card from red', $bus->run(new DrawCard('red')));
        $this->assertNull($bus->run(new ClearNotes));
    }

    public function test_an_unregistered_command_is_refused_before_anything_runs(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(1);

        $this->expectException(CommandNotRegistered::class);

        $this->app->make(CommandBus::class)->run(new AddItem(1, ItemSize::Small, []));
    }

    public function test_the_ninth_nested_dispatch_is_refused_and_the_count_comes_back_down(): void
    {
        $nesting = $this->app->make(CommandNesting::class);

        foreach (range(1, 8) as $level) {
            $nesting->enter();
        }

        try {
            $nesting->enter();
            $this->fail('A ninth level was let through.');
        } catch (CommandNestingTooDeep) {
            foreach (range(1, 8) as $level) {
                $nesting->leave();
            }
        }

        $nesting->enter();
        $this->addToAssertionCount(1);
    }

    public function test_a_command_without_an_actor_runs_nothing(): void
    {
        $this->installCommandModules();

        $this->expectException(ActorContextMissing::class);

        $this->app->make(CommandBus::class)->run(new WriteNote('never'));
    }

    public function test_a_user_only_command_run_by_an_agent_is_refused(): void
    {
        $this->installCommandModules();
        $this->startRequestAs(7, 70);

        $this->expectException(UserActorRequired::class);

        $this->app->make(CommandBus::class)->run(new UserNote('mine'));
    }

    public function test_each_command_logs_its_name_owner_actor_and_outcome_and_no_field(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(1);
        Log::spy();

        $this->app->make(CommandBus::class)->run(new WriteNote('private text'));

        Log::shouldHaveReceived('info')->withArgs(fn (string $line, array $context) => $line === 'Command WriteNote done'
            && $context['owner'] === 'Notes' && $context['actor'] === 'user:1' && ! str_contains((string) json_encode($context), 'private text'));
    }

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

    public function test_module_middleware_runs_by_stage_then_owner_then_declaration(): void
    {
        $trail = $this->installCommandModules();
        $this->startUserRequestAs(1);

        $this->app->make(CommandBus::class)->run(new WriteNote('ordered'));

        $this->assertSame(['cards around all', 'notes around all', 'notes around write', 'notes inside'], $trail->steps);
    }

    public function test_a_replacement_reaches_the_handler_and_a_refusal_writes_nothing(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(UppercasesText::class, CommandScope::command(WriteNote::class)));
        $this->startUserRequestAs(1);

        $this->assertSame('LOUD', $this->rowText($this->app->make(CommandBus::class)->run(new WriteNote('loud'))));

        $this->installCommandModules(MiddlewareDeclaration::around(RefusesAll::class, CommandScope::all()));
        $this->startUserRequestAs(1);
        $this->expectException(CommandRefused::class);
        $this->app->make(CommandBus::class)->run(new WriteNote('refused'));
    }

    /**
     * @return iterable<string, array{class-string, class-string<\Throwable>}>
     */
    public static function misbehavingMiddleware(): iterable
    {
        yield 'skips the command' => [SkipsCommand::class, MiddlewareSkippedCommand::class];
        yield 'calls next twice' => [CallsNextTwice::class, ContinuationCalledTwice::class];
        yield 'changes the result' => [ChangesResult::class, CommandResultChanged::class];
    }

    #[DataProvider('misbehavingMiddleware')]
    public function test_a_middleware_that_breaks_its_contract_is_refused_by_name(string $middleware, string $refusal): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around($middleware, CommandScope::all()));
        $this->startUserRequestAs(1);

        $this->expectException($refusal);
        $this->expectExceptionMessage($middleware);

        $this->app->make(CommandBus::class)->run(new WriteNote('broken'));
    }

    public function test_a_middleware_that_swallows_a_failure_is_refused_and_keeps_the_failure(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::inside(SwallowsFailure::class, CommandScope::all()));
        $this->startUserRequestAs(1);

        try {
            $this->app->make(CommandBus::class)->run(new RefuseNote('swallowed'));
            $this->fail('The swallowed failure was let through.');
        } catch (MiddlewareSwallowedFailure $failure) {
            $this->assertInstanceOf(CommandRefused::class, $failure->getPrevious());
        }
    }

    public function test_a_middleware_may_not_replace_another_owners_private_command(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(ReplacesCardsCommand::class, CommandScope::all()));
        $this->startUserRequestAs(1);

        $this->expectException(CommandReplacementRefused::class);

        $this->app->make(CommandBus::class)->run(new ShuffleDeck('red'));
    }

    public function test_a_refusal_is_a_form_error_on_the_web_and_a_403_on_an_agent_route(): void
    {
        Route::post('/bus-test/refuse', fn () => throw CommandRefused::because('Notes are closed for now.'))->middleware('web');

        $this->from('/somewhere')->post('/bus-test/refuse')->assertRedirect('/somewhere')->assertSessionHasErrors(['command' => 'Notes are closed for now.']);
        $this->postJson('/bus-test/refuse')->assertStatus(403)->assertExactJson(['message' => 'Notes are closed for now.']);
    }

    public function test_each_request_gets_its_own_bus_with_its_own_actor(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(1);
        $first = $this->app->make(CommandBus::class);

        try {
            $first->run(new RefuseNote('first request fails'));
        } catch (CommandRefused) {
        }

        $this->app->forgetScopedInstances();
        $this->startRequestAs(9, 90);
        $second = $this->app->make(CommandBus::class);
        Log::spy();
        $second->run(new WriteNote('second request'));

        $this->assertNotSame($first, $second);
        Log::shouldHaveReceived('info')->withArgs(fn (string $line, array $context) => $context['actor'] === 'agent:9');
    }

    protected function connectionsToTransact(): array
    {
        return [];
    }

    private function rowText(int $id): string
    {
        return (string) $this->app->make(ConnectionInterface::class)->table('module_command_rows')->where('id', $id)->value('text');
    }

    private function rowCount(): int
    {
        return $this->app->make(ConnectionInterface::class)->table('module_command_rows')->whereNot('text', 'like', 'audit %')->count();
    }
}
