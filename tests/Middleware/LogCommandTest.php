<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\CommandMiddleware\LogCommand;
use App\Contracts\Bus\CommandBus;
use Illuminate\Support\Facades\Log;
use Mockery;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Support\Bus\RunsModuleCommands;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Each command logs one line: its name, owner, actor and how it ended, with the queries it ran and the models it
 * loaded, never a field of the command and never a time.
 */
#[TestsMiddleware(LogCommand::class)]
final class LogCommandTest extends TestCase
{
    use RunsModuleCommands;

    /**
     * None at the start: the test modules' table is made as a test sets up and emptied when it ends.
     */
    private const array TABLES = [];

    public function test_each_command_logs_its_name_owner_actor_and_outcome_and_no_field(): void
    {
        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));
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

    public function test_the_command_log_line_counts_queries_and_models_and_no_time(): void
    {
        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));
        Log::spy();

        $this->app->make(CommandBus::class)->run(new WriteNoteCommand('counted'));

        Log::shouldHaveReceived('info')->with(
            'Command WriteNote done',
            Mockery::on(
                fn (array $context): bool => $context['queries_run'] > 0 && isset(
                    $context['models_loaded'],
                ) && ! isset($context['milliseconds']),
            ),
        )->once();
    }
}
