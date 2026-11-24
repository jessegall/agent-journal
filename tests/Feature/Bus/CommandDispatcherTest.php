<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\CommandMiddleware\AdmitStack;
use App\CommandMiddleware\BindDispatcher;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\ActorContextMissing;
use App\Exceptions\CommandDispatcherMissing;
use App\Exceptions\CommandNotRegistered;
use App\Support\CommandScope;
use App\Support\MiddlewareDeclaration;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordDispatcher;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\UppercasesText;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Support\TestIds;

/**
 * The bus binds the request's actor to every command it runs: middleware and handler read it from the
 * command, the caller's own object stays unbound, a replacement is bound to the same actor, and a call without an
 * actor is refused where the dispatcher is bound.
 */
final class CommandDispatcherTest extends CommandBusTestCase
{
    private const string DISPATCH_STEP = 'dispatched by user:%s';

    public function test_the_command_passed_on_reports_the_requests_actor_and_the_callers_object_stays_unbound(): void
    {
        $trail = $this->installCommandModules(
            MiddlewareDeclaration::inside(RecordDispatcher::class, CommandScope::command(WriteNoteCommand::class)),
        );
        $this->startUserRequestAs(TestIds::of(1));
        $note = new WriteNoteCommand('bound');

        $this->app->make(CommandBus::class)->run($note);

        $this->assertContains(sprintf(self::DISPATCH_STEP, TestIds::of(1)), $trail->steps);
        $this->expectException(CommandDispatcherMissing::class);
        $note->dispatchedBy();
    }

    public function test_a_replaced_command_is_bound_to_the_calls_actor(): void
    {
        $trail = $this->installCommandModules(
            MiddlewareDeclaration::around(UppercasesText::class, CommandScope::command(WriteNoteCommand::class)),
            MiddlewareDeclaration::inside(RecordDispatcher::class, CommandScope::command(WriteNoteCommand::class)),
        );
        $this->startUserRequestAs(TestIds::of(1));

        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('loud'));

        $this->assertContains(sprintf(self::DISPATCH_STEP, TestIds::of(1)), $trail->steps);
    }

    public function test_a_call_without_an_actor_is_refused_where_the_dispatcher_is_bound_before_the_stack(): void
    {
        $this->installCommandModules();

        $refusal = null;

        try {
            $this->app->make(CommandBus::class)->run(new WriteNoteCommand('never'));
        } catch (ActorContextMissing $missing) {
            $refusal = $missing;
        }

        $this->assertInstanceOf(ActorContextMissing::class, $refusal);
        $steps = array_column($refusal->getTrace(), 'class');
        $this->assertContains(BindDispatcher::class, $steps);
        $this->assertNotContains(AdmitStack::class, $steps);
    }

    public function test_an_unknown_command_without_an_actor_is_refused_as_unknown_first(): void
    {
        $this->expectException(CommandNotRegistered::class);

        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('unknown'));
    }
}
