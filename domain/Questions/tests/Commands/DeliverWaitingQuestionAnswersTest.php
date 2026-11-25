<?php

declare(strict_types=1);

namespace Domain\Questions\Tests\Commands;

use App\Enums\Accounts\CommandEntry;
use Domain\Questions\Commands\DeliverWaitingQuestionAnswers\DeliverWaitingQuestionAnswersCommand;
use Domain\Questions\Models\QuestionAnswerNotice;
use Domain\Questions\Tests\Fixtures\QuestionFixtures;
use Domain\Questions\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * The journal hands an agent's running session the notices of answers it has not had yet, oldest first, and counts
 * them; a notice already delivered is not sent again.
 */
final class DeliverWaitingQuestionAnswersTest extends TestCase
{
    use CommitsHookRows;

    private const string TRUSTED_ENTRY = 'opened session';

    private const array TABLES = [
        'questions',
        'question_answer_notices',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Planner')->sharedInbox('Owner', 'Planner');
    }

    public function test_the_waiting_notices_go_to_the_running_session_and_are_counted(): void
    {
        $first = $this->waitingNotice('Which database?');
        $second = $this->waitingNotice('Which port?');

        $delivered = $this->deliver();

        $this->assertSame(2, $delivered);
        $this->assertNotNull($first->refresh()->delivered_at);
        $this->assertNotNull($second->refresh()->delivered_at);
    }

    public function test_a_delivered_notice_is_not_sent_again(): void
    {
        $this->waitingNotice('Which database?');
        $this->deliver();

        $this->assertSame(0, $this->deliver());
    }

    private function deliver(): int
    {
        return $this->journal->runAsJournal(
            CommandEntry::EngineMaintenance,
            self::TRUSTED_ENTRY,
            new DeliverWaitingQuestionAnswersCommand($this->journal->agentCalled('Planner')->id),
        );
    }

    private function waitingNotice(string $text): QuestionAnswerNotice
    {
        $question = $this->journal->fixtures(QuestionFixtures::class)
            ->question($text, $this->journal->sharedInboxOf('Owner', 'Planner'), 'Planner', 'Owner', $text)
            ->questionCalled($text);

        return QuestionAnswerNotice::create($question, $this->journal->actorCalled('Planner'));
    }
}
