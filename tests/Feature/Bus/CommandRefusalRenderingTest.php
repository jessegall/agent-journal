<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Core\Bus\Exceptions\CommandRefused;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * A refusal as the caller sees it (doc 19, Book I): a form error on a web route and a 403 with its message on an
 * agent route.
 */
final class CommandRefusalRenderingTest extends TestCase
{
    public function test_a_refusal_is_a_form_error_on_the_web_and_a_403_on_an_agent_route(): void
    {
        Route::post('/bus-test/refuse', fn () => throw CommandRefused::because('Notes are closed for now.'))->middleware('web');

        $this->from('/somewhere')->post('/bus-test/refuse')->assertRedirect('/somewhere')->assertSessionHasErrors(['command' => 'Notes are closed for now.']);
        $this->postJson('/bus-test/refuse')->assertStatus(403)->assertExactJson(['message' => 'Notes are closed for now.']);
    }
}
