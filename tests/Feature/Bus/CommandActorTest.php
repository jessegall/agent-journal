<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Exceptions\SystemActorRequired;
use App\Actors\Exceptions\SystemNotAllowed;
use App\Actors\Exceptions\UserActorRequired;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorStore;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\EngineNotAllowed;
use App\Engine\Support\EngineActor;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Tests\Fixtures\Modules\Notes\Commands\EngineCopyNote;
use Tests\Fixtures\Modules\Notes\Commands\EngineNote;
use Tests\Fixtures\Modules\Notes\Commands\SystemNote;
use Tests\Fixtures\Modules\Notes\Commands\UserNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;
use Tests\Support\TestIds;

/**
 * The actor of a command (doc 19, Book D): no command runs without one, a user-only command refuses an agent, the
 * system runs only a command that names it, and the log line names the command, its owner, the actor and the outcome
 * but no field.
 */
final class CommandActorTest extends CommandBusTestCase
{
    public function test_a_command_without_an_actor_runs_nothing(): void
    {
        $this->installCommandModules();

        $this->expectException(ActorContextMissing::class);

        $this->app->make(CommandBus::class)->run(new WriteNote('never'));
    }

    public function test_a_user_only_command_run_by_an_agent_is_refused(): void
    {
        $this->installCommandModules();
        $this->startRequestAs(TestIds::of(7), TestIds::of(70));

        $this->expectException(UserActorRequired::class);

        $this->app->make(CommandBus::class)->run(new UserNote('mine'));
    }

    public function test_the_system_is_refused_a_command_that_does_not_name_it_before_its_handler_runs(): void
    {
        $this->installCommandModules();

        $this->assertThrows(fn () => $this->app->make(ActorStore::class)->actAsSystem(fn () => $this->app->make(CommandBus::class)->run(new WriteNote('never'))), SystemNotAllowed::class);
        $this->assertSame(0, DB::table('module_command_rows')->count());
    }

    public function test_a_command_that_names_the_system_runs_as_the_system_and_refuses_others(): void
    {
        $this->installCommandModules();

        $this->assertSame(4, $this->app->make(ActorStore::class)->actAsSystem(fn () => $this->app->make(CommandBus::class)->run(new SystemNote('ping'))));

        $this->startRequestAs(TestIds::of(7), TestIds::of(70));

        $this->expectException(SystemActorRequired::class);

        $this->app->make(CommandBus::class)->run(new SystemNote('ping'));
    }

    public function test_each_command_logs_its_name_owner_actor_and_outcome_and_no_field(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(TestIds::of(1));
        $log = Log::spy();

        $this->app->make(CommandBus::class)->run(new WriteNote('private text'));

        $log->shouldHaveReceived('info')->withArgs(fn (string $line, array $context) => $line === 'Command WriteNote done'
            && $context['owner'] === 'Notes' && $context['actor'] === 'user:'.TestIds::of(1) && ! str_contains((string) json_encode($context), 'private text'));
    }

    public function test_the_engine_is_refused_a_command_that_does_not_allow_it(): void
    {
        $this->installCommandModules();
        $this->actAsEngine();

        $this->expectException(EngineNotAllowed::class);

        $this->app->make(CommandBus::class)->run(new WriteNote('never'));
    }

    public function test_the_engine_runs_a_command_that_allows_it(): void
    {
        $this->installCommandModules();
        $this->actAsEngine();

        $this->assertSame(4, $this->app->make(CommandBus::class)->run(new EngineNote('tick')));
    }

    public function test_a_command_for_users_refuses_the_engine(): void
    {
        $this->installCommandModules();
        $this->actAsEngine();

        $this->expectException(EngineNotAllowed::class);

        $this->app->make(CommandBus::class)->run(new UserNote('mine'));
    }

    public function test_a_nested_command_checks_the_engine_again(): void
    {
        $this->installCommandModules();
        $this->actAsEngine();

        $this->expectException(EngineNotAllowed::class);

        $this->app->make(CommandBus::class)->run(new EngineCopyNote('nested'));
    }

    private function actAsEngine(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::of(new EngineActor()));
    }
}
