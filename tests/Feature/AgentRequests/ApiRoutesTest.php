<?php

declare(strict_types=1);

namespace Tests\Feature\AgentRequests;

use App\Exceptions\KeyedWriteWithoutReceipt;
use App\Support\ApiRegistrar;
use Illuminate\Support\Facades\Route;
use Tests\Fixtures\AgentRequests\WriteNoteController;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A signed route registered from its call's declaration keeps the name its route file gives it, refuses a body field
 * the call does not declare and a keyed write without its key, and a keyed write that takes no receipt fails.
 */
final class ApiRoutesTest extends TestCase
{
    use RefreshHookDatabase;

    private const string NOT_A_FIELD = 'is not a field of this call';

    private const string KEY_REQUIRED = 'is required for a keyed write';

    private TestStart $start;

    protected function setUp(): void
    {
        parent::setUp();

        Route::middleware('journal.agent')->prefix('agent')->group(function (): void {
            $this->app->make(ApiRegistrar::class)->register(WriteNoteController::class)->name('test.notes.write');
        });
        $this->start = TestStart::start();
    }

    public function test_the_route_takes_its_path_from_the_call_and_keeps_its_name(): void
    {
        Route::getRoutes()->refreshNameLookups();

        $this->assertSame('agent/notes/{notebookId}/write', Route::getRoutes()->getByName('test.notes.write')?->uri());
    }

    public function test_an_undeclared_field_and_a_missing_key_are_refused(): void
    {
        $unknown = ['text' => 'Hi.', 'request_key' => 'key-1', 'notebookId' => 'other'];

        $this->journal->agentCall($this->start, 'POST', '/agent/notes/book-1/write', $unknown)
            ->assertStatus(422)
            ->assertJsonPath('code', 'invalid_input')
            ->assertJsonPath('details.fields.notebookId.0', self::NOT_A_FIELD);
        $this->journal->agentCall($this->start, 'POST', '/agent/notes/book-1/write', ['text' => 'Hi.'])
            ->assertStatus(422)
            ->assertJsonPath('details.fields.request_key.0', self::KEY_REQUIRED);
    }

    public function test_a_keyed_write_that_takes_no_receipt_fails(): void
    {
        $this->withoutExceptionHandling();
        $this->expectException(KeyedWriteWithoutReceipt::class);

        $this->journal->agentCall(
            $this->start,
            'POST',
            '/agent/notes/book-1/write',
            ['text' => 'Hi.', 'request_key' => 'key-1'],
        );
    }
}
