<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\CommandEntry;
use App\Exceptions\ActorContextMissing;
use App\Exceptions\CommandNotRegistered;
use App\Support\ActorContext;
use App\Support\ActorStore;
use App\Support\CommandEntrance;
use App\Support\EngineAccess;
use App\Support\EngineActor;
use App\Values\TrustedEntryAuthority;
use Closure;
use Illuminate\Support\Facades\Log;
use Tests\Fixtures\Modules\Notes\Commands\EngineCopyNote\EngineCopyNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\EngineNote\EngineNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Support\TestIds;

/**
 * The actor of a command: no command runs without one, the engine runs one only under a grant, and
 * the log line names the command, its owner, the actor and the outcome but no field.
 */
final class CommandActorTest extends CommandBusTestCase
{
    public function test_a_command_without_an_actor_runs_nothing(): void
    {
        $this->installCommandModules();

        $this->expectException(ActorContextMissing::class);

        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('never'));
    }

    public function test_the_journal_acting_through_a_trusted_entry_is_refused_an_application_command(): void
    {
        $this->installCommandModules();

        $run = fn () => $this->app->make(CommandBus::class)->run(new WriteNoteCommand('never'));
        $this->assertThrows(
            fn () => $this->app->make(ActorStore::class)->actAsSystem('test', $run),
            CommandNotRegistered::class,
        );
        $this->assertSame(0, $this->rowCount());
    }

    public function test_each_command_logs_its_name_owner_actor_and_outcome_and_no_field(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);
        $log = Log::spy();

        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('private text'));

        $log->shouldHaveReceived('info')->withArgs(fn (
            string $line,
            array $context,
        ) => $line === 'Command WriteNote done'
                && $context['owner'] === 'Notes'
                && $context['actor'] === 'user:'.TestIds::of(1)
                && ! str_contains((string) json_encode($context), 'private text'));
    }

    public function test_the_engine_outside_a_tick_is_refused_an_application_command(): void
    {
        $this->installCommandModules();
        $this->actAsEngine();

        $this->expectException(CommandNotRegistered::class);

        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('never'));
    }

    public function test_the_engine_runs_a_ticks_own_command(): void
    {
        $this->installCommandModules();
        $this->actAsEngine();

        $this->assertSame(4, $this->asTick(fn () => $this->app->make(CommandBus::class)->run(new EngineNoteCommand('tick'))));
    }

    public function test_a_nested_command_follows_the_ticks_command(): void
    {
        $this->installCommandModules();
        $this->actAsEngine();

        $this->asTick(fn () => $this->app->make(CommandBus::class)->run(new EngineCopyNoteCommand('nested')));

        $this->assertGreaterThan(0, $this->rowCount());
    }

    /**
     * Runs the work as a tick's own work: the engine holds a grant and the application's entrance is open.
     */
    private function asTick(Closure $work): mixed
    {
        $this->app->make(EngineAccess::class)->grantMaintenance('test-tick');

        return $this->app->make(CommandEntrance::class)->through(CommandEntry::Application, $work);
    }

    private function actAsEngine(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::of(new EngineActor()),
            new TrustedEntryAuthority('test'),
        );
    }
}
