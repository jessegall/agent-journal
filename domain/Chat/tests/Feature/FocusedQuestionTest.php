<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Commands\AskMessage\AskMessageCommand;
use App\Commands\CreateDesk\CreateDeskCommand;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Enums\ActorType;
use App\Models\DeskRecord;
use App\Models\Message;
use App\Models\NotificationReceipt;
use App\Models\NotificationScope;
use App\Resolvers\QuestionNotificationTarget;
use App\Support\ActorIdentity;
use App\Support\DeskSeating;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Tests\TestCase;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\StartsAgentRequests;
use Tests\Support\StartsMainAgents;
use Tests\Support\WritesInboxMessages;

/**
 * A question a notification opens shows passively, whichever agent is chosen: only after it is shown does the
 * reader's own receipt of it become read, and nobody's shared first read, holder or other receipt moves.
 */
final class FocusedQuestionTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
    use StartsAgentRequests;
    use StartsMainAgents;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'agent_runtimes',
        'driver_requests',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'messages',
        'message_attentions',
        'links',
        'main_agent_designations',
        'notification_receipts',
        'notification_scopes',
        'notification_occurrences',
    ];

    private User $owner;

    /**
     * @var array{string, string}
     */
    private array $builder;

    private DeskRecord $team;

    /**
     * @var array{string, string}
     */
    private array $questions;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->builder = $this->startMainAgent('Builder');
        $reviewer = $this->startMainAgent('Reviewer');
        $this->asOwner();
        $this->team = DeskRecord::query()->findOrFail($this->runOnBus(new CreateDeskCommand('Team', 2, false)));

        foreach ([ActorIdentity::of($this->owner), $this->builderIdentity()] as $actor) {
            $this->app->make(AssignmentTransaction::class)->run(
                fn () => $this->app->make(DeskSeating::class)->seat($this->team->id, $actor),
            );
        }

        $reviewerInboxId = $this->inboxOf(new ActorIdentity(ActorType::Agent, $reviewer[0]))->inboxId();
        $this->app->forgetScopedInstances();
        $this->startRequestAs($reviewer[0], $reviewer[1]);

        $this->questions = [
            $this->runOnBus(new AskMessageCommand($reviewerInboxId, $this->team->inboxId(), 'Which port?')),
            $this->runOnBus(new AskMessageCommand($reviewerInboxId, $this->team->inboxId(), 'Which branch?')),
        ];

        $this->asOwner();
    }

    public function test_opening_an_exact_question_marks_only_the_readers_own_receipt_of_it(): void
    {
        [$first, $second] = $this->questions;

        $this->actingAs($this->owner)
            ->get('/chat?question='.$first)
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.data.focusedQuestionId', $first)
                ->where('page.data.focusedQuestion.question.id', $first)
                ->where('page.data.focusedQuestion.question.body', 'Which port?'));

        $this->assertNull($this->receiptOf(ActorIdentity::of($this->owner), $first)->read_at);

        $this->actingAs($this->owner)
            ->post('/communication/notifications/read-question', ['messageId' => $first])
            ->assertRedirect();

        $this->assertNotNull($this->receiptOf(ActorIdentity::of($this->owner), $first)->read_at);
        $this->assertNull($this->receiptOf(ActorIdentity::of($this->owner), $second)->read_at);
        $this->assertNull($this->receiptOf($this->builderIdentity(), $first)->read_at);
        $this->assertNull($this->receiptOf($this->builderIdentity(), $second)->read_at);
        $this->assertNull(Message::query()->acrossInboxes()->findOrFail($first)->read_at);
    }

    public function test_a_question_the_reader_cannot_see_is_named_unavailable_and_its_mark_is_refused(): void
    {
        $hidden = $this->askNobody('Out of sight.')->id;

        $this->actingAs($this->owner)
            ->get('/chat?question='.$hidden)
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.data.focusedQuestionId', $hidden)
                ->missing('page.data.focusedQuestion'));

        $this->actingAs($this->owner)
            ->post('/communication/notifications/read-question', ['messageId' => $hidden])
            ->assertRedirect()
            ->assertSessionHasErrors();
    }

    private function asOwner(): void
    {
        $this->app->forgetScopedInstances();
        $this->startUserRequestAs($this->owner->id);
    }

    private function builderIdentity(): ActorIdentity
    {
        return new ActorIdentity(ActorType::Agent, $this->builder[0]);
    }

    private function receiptOf(ActorIdentity $actor, string $messageId): NotificationReceipt
    {
        $scope = NotificationScope::query()
            ->where('recipient_type', $actor->type->value)
            ->where('recipient_id', $actor->id)
            ->sole();

        $key = QuestionNotificationTarget::occurrenceKey($messageId);

        return NotificationReceipt::findForOccurrence($scope->id, $key)->get();
    }
}
