<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Exceptions\SystemActorRequired;
use App\Actors\Exceptions\UserActorRequired;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorStore;
use App\Actors\Values\TrustedEntryAuthority;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Support\CommandEntrance;
use App\Engine\Support\EngineActor;
use Closure;
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

    public function test_the_journal_acting_through_a_trusted_entry_is_refused_an_application_command(): void
    {
        $this->installCommandModules();

        $run = fn () => $this->app->make(CommandBus::class)->run(new WriteNote('never'));
        $this->assertThrows(
            fn () => $this->app->make(ActorStore::class)->actAsSystem('test', $run),
            CommandNotRegistered::class,
        );
        $this->assertSame(0, DB::table('module_command_rows')->count());
    }

    public function test_a_command_that_names_the_system_refuses_a_user(): void
    {
        $this->installCommandModules();
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

    public function test_the_engine_outside_a_tick_is_refused_an_application_command(): void
    {
        $this->installCommandModules();
        $this->actAsEngine();

        $this->expectException(CommandNotRegistered::class);

        $this->app->make(CommandBus::class)->run(new WriteNote('never'));
    }

    public function test_the_engine_runs_a_ticks_own_command(): void
    {
        $this->installCommandModules();
        $this->actAsEngine();

        $this->assertSame(4, $this->asTick(fn () => $this->app->make(CommandBus::class)->run(new EngineNote('tick'))));
    }

    public function test_a_command_for_users_refuses_the_engine_inside_a_tick(): void
    {
        $this->installCommandModules();
        $this->actAsEngine();

        $this->expectException(UserActorRequired::class);

        $this->asTick(fn () => $this->app->make(CommandBus::class)->run(new UserNote('mine')));
    }

    public function test_a_nested_command_follows_the_ticks_command(): void
    {
        $this->installCommandModules();
        $this->actAsEngine();

        $this->asTick(fn () => $this->app->make(CommandBus::class)->run(new EngineCopyNote('nested')));

        $this->assertGreaterThan(0, DB::table('module_command_rows')->count());
    }

    /**
     * Runs the work as a tick's own work, with the application's entrance opened for its commands.
     */
    private function asTick(Closure $work): mixed
    {
        return $this->app->make(CommandEntrance::class)->through(CommandEntry::Application, $work);
    }

    private function actAsEngine(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::of(new EngineActor()), new TrustedEntryAuthority('test'));
    }
}
