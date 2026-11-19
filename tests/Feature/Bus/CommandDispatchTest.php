<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandNestingTooDeep;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Support\CommandNesting;
use App\Bus\Support\LaravelCommandBus;
use Illuminate\Support\Facades\Log;
use Mockery;
use Tests\Fixtures\Bus\Shop\Commands\AddItem;
use Tests\Fixtures\Bus\Shop\Enums\ItemSize;
use Tests\Fixtures\Modules\Cards\Commands\DrawCard;
use Tests\Fixtures\Modules\Notes\Commands\ClearNotes;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;

/**
 * Dispatching on the command bus (doc 19, Book C): every registered command reaches its handler and its result comes
 * back unchanged, an unregistered command is refused before anything runs, and nesting stops at eight levels.
 */
final class CommandDispatchTest extends CommandBusTestCase
{
    public function test_every_registered_command_has_its_handler_and_its_result_comes_back_unchanged(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);
        $bus = $this->app->make(CommandBus::class);

        $this->assertInstanceOf(LaravelCommandBus::class, $bus);
        $this->assertTrue($bus->hasHandlerFor(new DrawCard('red')));
        $this->assertSame('card from red', $bus->run(new DrawCard('red')));
        $bus->run(new WriteNote('cleared'));
        $bus->run(new ClearNotes());
        $this->assertSame(0, $this->rowCount());
    }

    public function test_the_command_log_line_counts_queries_and_models_and_no_time(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);
        Log::spy();

        $this->app->make(CommandBus::class)->run(new WriteNote('counted'));

        Log::shouldHaveReceived('info')->with('Command WriteNote done', Mockery::on(fn (array $context): bool => $context['queries_run'] > 0 && isset($context['models_loaded']) && ! isset($context['milliseconds'])))->once();
    }

    public function test_an_unregistered_command_is_refused_before_anything_runs(): void
    {
        $this->installCommandModules();
        $this->startTestUserRequest(1);

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
}
