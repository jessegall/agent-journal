<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Commands\Messages\AskMessage\AskMessageCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Assignments\ActorType;
use App\Enums\Messages\DismissalType;
use App\Models\Access\User;
use App\Models\Messages\Message;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\RequestKey;
use Domain\Chat\Tests\TestCase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\StartsMainAgents;
use Tests\Support\WritesInboxMessages;

/**
 * The owner reads another inbox's history as a labelled inspection that marks nothing read, and cancels a question
 * left waiting there with a reason.
 */
final class HistoryPageTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;
    use StartsMainAgents;
    use WritesInboxMessages;

    private const string CANCEL_REASON = 'Nobody works on this.';

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'messages',
        'message_attentions',
        'links',
    ];

    public function test_the_owner_inspects_an_agents_inbox_and_cancels_a_waiting_question(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $builder = $this->startMainAgent('Builder');
        $reviewer = $this->startMainAgent('Reviewer');
        $builderInboxId = $this->inboxOf(new ActorIdentity(ActorType::Agent, $builder[0]))->inboxId();
        $reviewerInboxId = $this->inboxOf(new ActorIdentity(ActorType::Agent, $reviewer[0]))->inboxId();
        $this->startRequestAs($reviewer[0], $reviewer[1]);
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        $questionId = $this->app->make(CommandBus::class)
            ->run(new AskMessageCommand($reviewerInboxId, $builderInboxId, 'Still needed?'));

        $this->actingAs($owner)
            ->get('/chat/history?inbox='.$builderInboxId)
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.data.root.children.0.key', 'inspection')
                ->where('page.data.root.children.1.children.0.key', $questionId)
                ->where('page.data.root.children.1.children.0.children.2.form.fixed.messageId', $questionId));

        $this->assertNull($this->stored($questionId)->read_at);

        $this->actingAs($owner)
            ->post('/chat/history/cancel', [
                'messageId' => $questionId,
                'reason' => self::CANCEL_REASON,
            ])
            ->assertRedirect();

        $this->assertSame(DismissalType::Cancelled, $this->stored($questionId)->dismissal_type);
        $this->assertSame(self::CANCEL_REASON, $this->stored($questionId)->dismissal_reason);
    }

    private function stored(string $messageId): Message
    {
        return Message::query()->withoutGlobalScopes()->findOrFail($messageId);
    }
}
