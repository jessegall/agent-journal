<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\Accounts\Enums\CommandEntry;
use App\Actors\ActorStore;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\SystemActor;
use App\Bus\CommandEntrance;
use App\Bus\CommandMiddleware\CheckEntry;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Engine\EngineAccess;
use App\Support\ActorReference;
use App\Values\TrustedEntryAuthority;
use Closure;
use Tests\Fixtures\Modules\Notes\Commands\EngineCopyNote\EngineCopyNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\EngineNote\EngineNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Support\Bus\RunsModuleCommands;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\TestCase;

/**
 * A command runs only through its own entry: the journal acting through a trusted entry is refused an application
 * command as unknown, the engine runs one only as a tick's own work, and a command the tick's command dispatches
 * follows it.
 */
#[TestsMiddleware(CheckEntry::class)]
final class CheckEntryTest extends TestCase
{
    use RunsModuleCommands;

    /**
     * None at the start: the test modules' table is made as a test sets up and emptied when it ends.
     */
    private const array TABLES = [];

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

        $written = $this->asTick(fn () => $this->app->make(CommandBus::class)->run(new EngineNoteCommand('tick')));

        $this->assertSame(4, $written);
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
            ActorReference::of(new SystemActor()),
            new TrustedEntryAuthority('test'),
        );
    }
}
