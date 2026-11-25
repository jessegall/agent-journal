<?php

declare(strict_types=1);

namespace Domain\Questions\Tests\Commands;

use App\Enums\Accounts\CommandEntry;
use App\Models\Notifications\NotificationReceipt;
use Domain\Questions\Commands\AskQuestion\AskQuestionCommand;
use Domain\Questions\Commands\HideLeftInboxNotifications\HideLeftInboxNotificationsCommand;
use Domain\Questions\Enums\QuestionType;
use Domain\Questions\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestProjects;

/**
 * Once a member leaves an inbox, the journal hides the notifications of the questions asked of them there and counts
 * them; the questions of other inboxes stay notified.
 */
#[TestsCommand(HideLeftInboxNotificationsCommand::class)]
final class HideLeftInboxNotificationsTest extends TestCase
{
    use CommitsHookRows;

    private const string TRUSTED_ENTRY = 'left inbox';

    private const array TABLES = ['questions'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Planner')->agent('Builder')
            ->sharedInbox('Owner', 'Planner')->sharedInbox('Owner', 'Builder');
    }

    public function test_the_questions_of_the_left_inbox_lose_their_notifications_and_other_inboxes_stay_notified(): void
    {
        $this->ask('Planner');
        $this->ask('Builder');
        $owner = $this->journal->actorCalled('Owner');

        $hidden = $this->journal->runAsJournal(
            CommandEntry::EngineMaintenance,
            self::TRUSTED_ENTRY,
            new HideLeftInboxNotificationsCommand(
                $owner->type,
                $owner->id,
                $this->journal->sharedInboxOf('Owner', 'Planner')->id,
            ),
        );

        $this->assertSame(1, $hidden);
        $this->assertSame(1, NotificationReceipt::query()->whereNull('hidden_at')->count());
    }

    private function ask(string $agent): void
    {
        $this->journal->actAs($agent)->run(new AskQuestionCommand(
            $this->journal->sharedInboxOf('Owner', $agent)->id,
            $this->journal->actorCalled('Owner'),
            'Which database?',
            QuestionType::Open,
            TestProjects::local()->id,
        ));
    }
}
