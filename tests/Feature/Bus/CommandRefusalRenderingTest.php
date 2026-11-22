<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Enums\RefusalCode;
use App\Exceptions\CommandInputInvalid;
use App\Exceptions\CommandRefused;
use App\Exceptions\InputRefused;
use App\Support\OneLineRule;
use App\Support\RefusalMapper;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

/**
 * A refusal as the caller sees it (doc 19, Book I): a form error on a web page, and on a JSON request the refusal's
 * code, message and fields with its status. Refused input (doc 49, Book 3) is a 422 invalid-input with its fields.
 */
final class CommandRefusalRenderingTest extends TestCase
{
    private const string REFUSED_HEAD = "The input was refused.\ntitle: The title must be one line";

    private const string REVISION_LINE = "\nexpectedRevision: The expected revision field must be at least 1.";

    private const string CONSOLE_HEAD = "The journal refused the call (invalid_input): The input was refused.\ntitle: ";

    private const string SECRET_TITLE = "Secret\nnotes";

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
