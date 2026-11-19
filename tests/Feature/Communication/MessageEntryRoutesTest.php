<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use Tests\Support\MessagingTestCase;

/**
 * A person sends, asks and pages through messages over Core's own HTTP entries, named by inbox ids and answered with
 * data, never a page; a request that names a session or an actor instead of inboxes is refused.
 */
final class MessageEntryRoutesTest extends MessagingTestCase
{
    public function test_a_person_sends_asks_and_reads_back_over_http(): void
    {
        $pair = ['sourceInboxId' => $this->ownerInboxId(), 'destinationInboxId' => $this->inboxIdOf($this->builder)];

        $sent = $this->actingAs($this->owner)->postJson('/communication/send', [...$pair, 'body' => 'FYI.']);
        $asked = $this->actingAs($this->owner)->postJson('/communication/ask', [...$pair, 'body' => 'Port?']);
        $sent->assertOk();
        $asked->assertOk();

        $history = $this->actingAs($this->owner)
            ->getJson('/communication/history?'.http_build_query(['inboxId' => $this->ownerInboxId()]))
            ->assertOk();
        $this->assertSame(
            [$sent->json('messageId'), $asked->json('messageId')],
            array_column($history->json('messages'), 'id'),
        );
        $this->actingAs($this->owner)
            ->getJson('/communication/show?'.http_build_query(['messageId' => $asked->json('messageId')]))
            ->assertOk()
            ->assertJson(['body' => 'Port?', 'state' => 'waiting_for_answer']);
        $this->actingAs($this->owner)
            ->getJson('/communication/wake-status?'.http_build_query(['messageId' => $asked->json('messageId')]))
            ->assertOk()
            ->assertJsonCount(1);
    }

    public function test_a_send_named_by_session_instead_of_inboxes_is_refused(): void
    {
        $this->actingAs($this->owner)
            ->postJson('/communication/send', ['session' => $this->builder->id, 'body' => 'Hello'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['sourceInboxId', 'destinationInboxId']);
    }
}
