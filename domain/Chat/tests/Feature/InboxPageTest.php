<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Commands\Desks\CreateDesk\CreateDeskCommand;
use App\Commands\Messages\AskMessage\AskMessageCommand;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Models\Access\User;
use App\Models\Desks\DeskRecord;
use App\Models\Messages\Message;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\DeskSeatService;
use Domain\Chat\Tests\TestCase;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

/**
 * The Inbox page lists every inbox a user sits at with what waits in it, marks nothing read by being looked at,
 * and claims the next waiting question on request.
 */
final class InboxPageTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
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

    public function test_a_user_at_two_inboxes_sees_both_and_takes_the_next_question(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
        $own = $this->inboxOf(ActorIdentity::of($owner));
        $team = DeskRecord::query()->findOrFail($this->runOnBus(new CreateDeskCommand('Team', 2, false)));

        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(DeskSeatService::class)->seat($team->id, ActorIdentity::of($owner)),
        );

        $questionId = $this->runOnBus(new AskMessageCommand($own->inboxId(), $team->inboxId(), 'Who takes this?'));

        $this->actingAs($owner)->get('/chat/inbox')->assertInertia(fn (AssertableInertia $page) => $page
            ->has('page.data.root.children', 2)
            ->where('page.data.root.children.0.children.1.native.component', 'chat/InboxMessages'));

        $this->assertNull(Message::query()->withoutGlobalScopes()->findOrFail($questionId)->read_at);

        $this->actingAs($owner)->post('/chat/inbox/take-next', ['inboxId' => $team->inboxId()])->assertRedirect();

        $this->assertNotNull(Message::query()->withoutGlobalScopes()->findOrFail($questionId)->read_at);
    }
}
