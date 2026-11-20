<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\MessagingTestCase;
use Tests\Support\SendsMcpFrames;

/**
 * A person sends, asks and pages through messages over Core's own HTTP entries, named by inbox ids and answered with
 * data, never a page; a request that names a session or an actor instead of inboxes is refused.
 */
final class MessageEntryRoutesTest extends MessagingTestCase
{
    use SendsMcpFrames;

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

    public function test_an_agent_reads_replies_and_pages_history_over_mcp(): void
    {
        $caller = TestStart::start();
        $callerInboxId = $this->inboxOf(new ActorIdentity(ActorType::Agent, $caller->agent->id))->inboxId();
        $questionId = $this->ownerAsks($callerInboxId, 'Which port?');

        $read = $this->callMcpTool($caller, 'messages_acknowledge', [
            'inbox_id' => $callerInboxId,
            'message_ids' => [$questionId],
            'request_key' => (string) Str::ulid(),
        ]);
        $this->assertFalse($read->json('result.isError'), (string) json_encode($read->json('result')));
        $showing = $this->callMcpTool($caller, 'messages_read', ['message_id' => $questionId]);
        $this->assertFalse($showing->json('result.isError'), (string) json_encode($showing->json('result')));
        $shown = $showing->json('result.structuredContent.message');
        $replied = $this->callMcpTool($caller, 'messages_reply', [
            'message_id' => $questionId,
            'state_version' => $shown['revision'] - 1,
            'body' => 'Port 8080.',
            'request_key' => (string) Str::ulid(),
        ]);
        $this->assertFalse($replied->json('result.isError'), (string) json_encode($replied->json('result')));
        $history = $this->callMcpTool($caller, 'inbox_history', ['inbox_id' => $callerInboxId])
            ->json('result.structuredContent.page.messages');

        $this->assertTrue($read->json('result.structuredContent.results.0.takenUp'));
        $this->assertSame(['Which port?', 'Port 8080.'], array_column($history, 'body'));
    }

    public function test_a_send_named_by_session_instead_of_inboxes_is_refused(): void
    {
        $this->actingAs($this->owner)
            ->postJson('/communication/send', ['session' => $this->builder->id, 'body' => 'Hello'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['sourceInboxId', 'destinationInboxId']);
    }
}
