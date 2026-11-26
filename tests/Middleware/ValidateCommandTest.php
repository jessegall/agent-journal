<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\Access\Contracts\OperationResolver;
use App\Access\Exceptions\OperationUnavailable;
use App\Actors\ActorStore;
use App\Api\Exceptions\InputRefused;
use App\Bus\CommandMiddleware\ValidateCommand;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandInputInvalid;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Exceptions\CommandRefused;
use App\Bus\RefusalMapper;
use App\Bus\RequestKey;
use App\Engine\Enums\RefusalCode;
use App\Text\OneLineRule;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;
use Tests\Fixtures\Modules\Notes\Commands\CopyLimitNote\CopyLimitNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\LimitNote\LimitNoteCommand;
use Tests\Support\Bus\RunsModuleCommands;
use Tests\Support\ClearsStartRows;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\TestCase;

/**
 * Before any lock, transaction or receipt, a command's input passes the rules its properties declare:
 * bad input never reaches the handler, a null optional field is not checked, and a nested command is checked too.
 */
#[TestsMiddleware(ValidateCommand::class)]
final class ValidateCommandTest extends TestCase
{
    use RunsModuleCommands;

    /**
     * None at the start: the test modules' table is made as a test sets up and emptied when it ends.
     */
    private const array TABLES = [];

    use ClearsStartRows;

    private const string REFUSED_HEAD = "The input was refused.\ntitle: The title must be one line";

    private const string REVISION_LINE = "\nexpectedRevision: The expected revision field must be at least 1.";

    private const string CONSOLE_HEAD = "The journal refused the call (invalid_input): The input was refused.\ntitle: ";

    private const string SECRET_TITLE = "Secret\nnotes";

    private const string TEXT_TOO_LONG = 'text: The text field must not be greater than 5 characters.';

    private const string KEY = '01JD8X0G9M3QZ6V4K2VA1DATE1';

    protected function setUp(): void
    {
        parent::setUp();

        $this->installCommandModules();
        $start = $this->journal->signedStart('Main agent', 'main-agent');
        $this->journal->actAsAgentIds($start->agent->id, $start->session->id);
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
        $this->assertThrows(
            fn () => $bus->run(new LimitNoteCommand('note', 'labels')),
            CommandInputInvalid::class,
            'label:',
        );
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

    public function test_a_refusal_is_a_form_error_on_the_web_and_a_403_on_an_agent_route(): void
    {
        Route::post('/bus-test/refuse', fn () => throw CommandRefused::because('Notes are closed for now.'))
            ->middleware('web');

        $this->from('/somewhere')
            ->post('/bus-test/refuse')
            ->assertRedirect('/somewhere')
            ->assertSessionHasErrors(['command' => 'Notes are closed for now.']);
        $this->postJson('/bus-test/refuse')
            ->assertStatus(403)
            ->assertExactJson(['code' => 'command-refused', 'message' => 'Notes are closed for now.', 'fields' => []]);
    }

    public function test_the_message_names_each_wrong_field_once_per_line_and_never_its_value(): void
    {
        $message = $this->refusedInput()->getMessage();

        $this->assertStringStartsWith(self::REFUSED_HEAD, $message);
        $this->assertStringContainsString(
            self::REVISION_LINE,
            $message,
        );
        $this->assertStringNotContainsString('Secret', $message);
    }

    public function test_refused_input_is_a_422_with_its_fields_on_a_json_route(): void
    {
        Route::post('/bus-test/invalid-input', fn () => throw $this->refusedInput())->middleware('web');

        $this->postJson('/bus-test/invalid-input', ['title' => self::SECRET_TITLE])
            ->assertStatus(422)
            ->assertJsonPath('code', 'invalid-input')
            ->assertJsonStructure(['fields' => ['title', 'expectedRevision']]);
    }

    public function test_refused_input_is_a_field_error_with_old_input_on_a_page(): void
    {
        Route::post('/bus-test/invalid-input', fn () => throw $this->refusedInput())->middleware('web');

        $this->from('/somewhere')
            ->post('/bus-test/invalid-input', ['title' => self::SECRET_TITLE])
            ->assertRedirect('/somewhere')
            ->assertSessionHasErrors(['title', 'expectedRevision'])
            ->assertSessionHasInput('title', self::SECRET_TITLE);
    }

    public function test_refused_input_is_invalid_input_to_mcp_and_an_agent_route(): void
    {
        $refusal = $this->app->make(RefusalMapper::class)->refusal($this->refusedInput(), 'test', 'id');
        Route::post('/agent/bus-test/invalid-input', fn () => throw $this->refusedInput());

        $this->assertSame(RefusalCode::InvalidInput, $refusal->code);
        $this->assertFalse($refusal->code->isRetryable());
        $this->postJson('/agent/bus-test/invalid-input')
            ->assertStatus(422)
            ->assertJsonPath('code', 'invalid_input')
            ->assertJsonPath('message', $this->refusedInput()->getMessage());
    }

    public function test_the_console_prints_the_refusal_after_its_code(): void
    {
        $refused = InputRefused::answered('invalid_input', $this->refusedInput()->getMessage(), 'call', null, []);

        $this->assertStringStartsWith(
            self::CONSOLE_HEAD,
            $refused->consoleLines()[0],
        );
    }

    private function refusedInput(): CommandInputInvalid
    {
        $validator = Validator::make(
            ['title' => self::SECRET_TITLE, 'expectedRevision' => 0],
            ['title' => ['string', new OneLineRule()], 'expectedRevision' => ['integer', 'min:1']],
        );
        $validator->passes();

        return CommandInputInvalid::from($validator);
    }
}
