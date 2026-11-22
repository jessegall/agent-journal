<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\CommandNestingTooDeep;
use App\Exceptions\CommandNotRegistered;
use App\Support\CommandNesting;
use App\Support\LaravelCommandBus;
use Illuminate\Support\Facades\Log;
use Mockery;
use Tests\Fixtures\Bus\Shop\Commands\AddItem\AddItemCommand;
use Tests\Fixtures\Bus\Shop\Enums\ItemSize;
use Tests\Fixtures\Modules\Cards\Commands\DrawCard\DrawCardCommand;
use Tests\Fixtures\Modules\Notes\Commands\ClearNotes\ClearNotesCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;

/**
 * Dispatching on the command bus (doc 19, Book C): every registered command reaches its handler and its result comes
 * back unchanged, an unregistered command is refused before anything runs, and nesting stops at eight levels.
 */
final class CommandDispatchTest extends CommandBusTestCase
{
    private const string DRAWN_CARD = 'card from red';

    public function test_every_registered_command_has_its_handler_and_its_result_comes_back_unchanged(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);
        $bus = $this->app->make(CommandBus::class);

        $this->assertInstanceOf(LaravelCommandBus::class, $bus);
        $this->assertTrue($bus->hasHandlerFor(new DrawCardCommand('red')));
        $this->assertSame(self::DRAWN_CARD, $bus->run(new DrawCardCommand('red')));
        $bus->run(new WriteNoteCommand('cleared'));
        $bus->run(new ClearNotesCommand());
        $this->assertSame(0, $this->rowCount());
    }

    public function test_the_command_log_line_counts_queries_and_models_and_no_time(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);
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

    public function test_an_unregistered_command_is_refused_before_anything_runs(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);

        $this->expectException(CommandNotRegistered::class);

        $this->app->make(CommandBus::class)->run(new AddItemCommand(1, ItemSize::Small, []));
    }

    public function test_the_ninth_nested_dispatch_is_refused_and_the_count_comes_back_down(): void
    {
        $nesting = $this->app->make(CommandNesting::class);

        foreach (range(1, 8) as $level) {
            $nesting->enter(AddItemCommand::class);
        }

        try {
            $nesting->enter(AddItemCommand::class);
            $this->fail('A ninth level was let through.');
        } catch (CommandNestingTooDeep) {
            foreach (range(1, 8) as $level) {
                $nesting->leave();
            }
        }

        $nesting->enter(AddItemCommand::class);
        $this->addToAssertionCount(1);
    }
}
