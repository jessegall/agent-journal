<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Actors\Support\ActorStore;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\OperationResolver;
use App\Bus\Exceptions\CommandInputInvalid;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Exceptions\OperationUnavailable;
use App\Bus\Support\RequestKey;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Fixtures\Modules\Notes\Commands\CopyLimitNote;
use Tests\Fixtures\Modules\Notes\Commands\LimitNote;
use Tests\Support\ClearsLaunchRows;

/**
 * Before any lock, transaction or receipt, a command's input passes the rules its properties declare (doc 49, Book 2):
 * bad input never reaches the handler, a null optional field is not checked, and a nested command is checked too.
 */
final class ValidateCommandTest extends CommandBusTestCase
{
    use ClearsLaunchRows;

    private const string KEY = '01JD8X0G9M3QZ6V4K2VA1DATE1';

    protected function setUp(): void
    {
        parent::setUp();

        $this->installCommandModules();
        $launch = TestLaunch::start();
        $this->startRequestAs($launch->agent->id, $launch->session->id);
    }

    public function test_a_value_over_its_limit_is_refused_before_the_handler(): void
    {
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new LimitNote('sixsix')),
            CommandInputInvalid::class,
            'text: The text field must not be greater than 5 characters.',
        );
        $this->assertSame(0, $this->rowCount());
    }

    public function test_a_value_within_its_limit_runs_unchanged(): void
    {
        $id = $this->app->make(CommandBus::class)->run(new LimitNote('five5', 'label'));

        $this->assertSame('five5', $this->rowText($id));
    }

    public function test_a_null_optional_field_is_not_checked_and_a_sent_one_is(): void
    {
        $bus = $this->app->make(CommandBus::class);

        $id = $bus->run(new LimitNote('note'));

        $this->assertSame('note', $this->rowText($id));
        $this->assertThrows(fn () => $bus->run(new LimitNote('note', 'labels')), CommandInputInvalid::class, 'label:');
    }

    public function test_a_nested_command_with_bad_input_fails_its_outer_command(): void
    {
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new CopyLimitNote('sixsix')),
            CommandInputInvalid::class,
        );
        $this->assertSame(0, $this->rowCount());
    }

    public function test_a_keyed_write_refused_for_its_input_can_be_sent_again_corrected_under_the_same_key(): void
    {
        $this->app->make(RequestKey::class)->set(self::KEY);
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(fn () => $bus->run(new LimitNote('sixsix')), CommandInputInvalid::class);
        $this->assertThrows(
            fn () => $this->app->make(OperationResolver::class)->operation(self::KEY),
            OperationUnavailable::class,
        );

        $id = $bus->run(new LimitNote('fixed'));

        $this->assertSame('fixed', $this->rowText($id));
    }

    public function test_an_actor_the_command_does_not_admit_gets_its_refusal_before_the_input_is_read(): void
    {
        $run = fn () => $this->app->make(CommandBus::class)->run(new LimitNote('sixsix'));

        $this->assertThrows(
            fn () => $this->app->make(ActorStore::class)->actAsSystem('test', $run),
            CommandNotRegistered::class,
        );
    }
}
