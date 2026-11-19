<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Actors\Exceptions\ActorContextMissing;
use App\Bus\CommandMiddleware\AdmitStack;
use App\Bus\CommandMiddleware\BindDispatcher;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandDispatcherMissing;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RecordDispatcher;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\UppercasesText;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;
use Tests\Support\TestIds;

/**
 * The bus binds the request's actor to every command it runs (doc 52): middleware and handler read it from the
 * command, the caller's own object stays unbound, a replacement is bound to the same actor, and a call without an
 * actor is refused where the dispatcher is bound.
 */
final class CommandDispatcherTest extends CommandBusTestCase
{
    public function test_the_command_passed_on_reports_the_requests_actor_and_the_callers_object_stays_unbound(): void
    {
        $trail = $this->installCommandModules(
            MiddlewareDeclaration::inside(RecordDispatcher::class, CommandScope::command(WriteNote::class)),
        );
        $this->startUserRequestAs(TestIds::of(1));
        $note = new WriteNote('bound');

        $this->app->make(CommandBus::class)->run($note);

        $this->assertContains('dispatched by user:'.TestIds::of(1), $trail->steps);
        $this->expectException(CommandDispatcherMissing::class);
        $note->dispatchedBy();
    }

    public function test_a_replaced_command_is_bound_to_the_calls_actor(): void
    {
        $trail = $this->installCommandModules(
            MiddlewareDeclaration::around(UppercasesText::class, CommandScope::command(WriteNote::class)),
            MiddlewareDeclaration::inside(RecordDispatcher::class, CommandScope::command(WriteNote::class)),
        );
        $this->startUserRequestAs(TestIds::of(1));

        $this->app->make(CommandBus::class)->run(new WriteNote('loud'));

        $this->assertContains('dispatched by user:'.TestIds::of(1), $trail->steps);
    }

    public function test_a_call_without_an_actor_is_refused_where_the_dispatcher_is_bound_before_the_stack(): void
    {
        $this->installCommandModules();

        $refusal = null;

        try {
            $this->app->make(CommandBus::class)->run(new WriteNote('never'));
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

        $this->app->make(CommandBus::class)->run(new WriteNote('unknown'));
    }
}
