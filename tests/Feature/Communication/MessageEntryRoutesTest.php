<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\MessagingTestCase;
use Tests\Support\SendsMcpFrames;

/**
 * A user sends, asks and pages through messages over Core's own HTTP entries, named by inbox ids and answered with
 * data, never a page; a request that names a session or an actor instead of inboxes is refused.
 */
final class MessageEntryRoutesTest extends MessagingTestCase
{
    use SendsMcpFrames;

    private const string QUESTION = 'Which port?';

    private const string ANSWER = 'Port 8080.';

    public function test_a_user_sends_asks_and_reads_back_over_http(): void
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

    public function test_an_agent_reads_and_replies_through_the_chat_tools(): void
    {
        $caller = TestStart::start();
        $callerInboxId = $this->inboxOf(ActorIdentity::ofClass(Agent::class, $caller->agent->id))->inboxId();
        $questionId = $this->ownerAsks($callerInboxId, self::QUESTION);

        $showing = $this->callMcpTool($caller, 'messages_read', ['message_id' => $questionId, 'view' => 'context']);
        $this->assertFalse($showing->json('result.isError'), (string) json_encode($showing->json('result')));
        $this->assertSame(self::QUESTION, $showing->json('result.structuredContent.body'));
        $shown = $showing->json('result.structuredContent.message');
        $replied = $this->callMcpTool($caller, 'messages_reply', [
            'message_id' => $questionId,
            'state_version' => $shown['revision'] - 1,
            'body' => self::ANSWER,
            'request_key' => (string) Str::ulid(),
        ]);
        $this->assertFalse($replied->json('result.isError'), (string) json_encode($replied->json('result')));
        $this->callMcpTool($caller, 'messages_read', [
            'message_id' => $replied->json('result.structuredContent.message_id'), 'view' => 'context',
        ])->assertJsonPath('result.structuredContent.body', self::ANSWER);
    }

    public function test_a_send_named_by_session_instead_of_inboxes_is_refused(): void
    {
        $this->actingAs($this->owner)
            ->postJson('/communication/send', ['session' => $this->builder->id, 'body' => 'Hello'])
            ->assertUnprocessable()
            ->assertJsonPath('code', 'invalid-input')
            ->assertJsonStructure(['fields' => ['sourceInboxId', 'destinationInboxId']]);
    }
}
