<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Contracts\CommandBus;
use App\Contracts\OperationResolver;
use App\Exceptions\CommandInputInvalid;
use App\Exceptions\CommandNotRegistered;
use App\Exceptions\OperationUnavailable;
use App\Support\ActorStore;
use App\Support\RequestKey;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Modules\Notes\Commands\CopyLimitNote\CopyLimitNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\LimitNote\LimitNoteCommand;
use Tests\Support\ClearsStartRows;

/**
 * Before any lock, transaction or receipt, a command's input passes the rules its properties declare (doc 49, Book 2):
 * bad input never reaches the handler, a null optional field is not checked, and a nested command is checked too.
 */
final class ValidateCommandTest extends CommandBusTestCase
{
    use ClearsStartRows;

    private const string TEXT_TOO_LONG = 'text: The text field must not be greater than 5 characters.';

    private const string KEY = '01JD8X0G9M3QZ6V4K2VA1DATE1';

    protected function setUp(): void
    {
        parent::setUp();

        $this->installCommandModules();
        $start = TestStart::start();
        $this->startRequestAs($start->agent->id, $start->session->id);
    }

    public function test_a_value_over_its_limit_is_refused_before_the_handler(): void
    {
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new LimitNoteCommand('sixsix')),
            CommandInputInvalid::class,
            self::TEXT_TOO_LONG,
        );
        $this->assertSame(0, $this->rowCount());
    }

    public function test_a_value_within_its_limit_runs_unchanged(): void
    {
        $id = $this->app->make(CommandBus::class)->run(new LimitNoteCommand('five5', 'label'));

        $this->assertSame('five5', $this->rowText($id));
    }

    public function test_a_null_optional_field_is_not_checked_and_a_sent_one_is(): void
    {
        $bus = $this->app->make(CommandBus::class);

        $id = $bus->run(new LimitNoteCommand('note'));

        $this->assertSame('note', $this->rowText($id));
        $this->assertThrows(fn () => $bus->run(new LimitNoteCommand('note', 'labels')), CommandInputInvalid::class, 'label:');
    }

    public function test_a_nested_command_with_bad_input_fails_its_outer_command(): void
    {
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new CopyLimitNoteCommand('sixsix')),
            CommandInputInvalid::class,
        );
        $this->assertSame(0, $this->rowCount());
    }

    public function test_a_keyed_write_refused_for_its_input_can_be_sent_again_corrected_under_the_same_key(): void
    {
        $this->app->make(RequestKey::class)->set(self::KEY);
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(fn () => $bus->run(new LimitNoteCommand('sixsix')), CommandInputInvalid::class);
        $this->assertThrows(
            fn () => $this->app->make(OperationResolver::class)->operation(self::KEY),
            OperationUnavailable::class,
        );

        $id = $bus->run(new LimitNoteCommand('fixed'));

        $this->assertSame('fixed', $this->rowText($id));
    }

    public function test_an_actor_the_command_does_not_admit_gets_its_refusal_before_the_input_is_read(): void
    {
        $run = fn () => $this->app->make(CommandBus::class)->run(new LimitNoteCommand('sixsix'));

        $this->assertThrows(
            fn () => $this->app->make(ActorStore::class)->actAsSystem('test', $run),
            CommandNotRegistered::class,
        );
    }
}
