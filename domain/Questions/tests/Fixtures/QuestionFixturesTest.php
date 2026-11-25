<?php

declare(strict_types=1);

namespace Domain\Questions\Tests\Fixtures;

use Domain\Questions\Commands\AnswerQuestion\AnswerQuestionCommand;
use Domain\Questions\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * A question arranged through the journal is open until its target answers: the answer is kept trimmed with its time,
 * and the asker is given one delivered notice of it.
 */
final class QuestionFixturesTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['questions', 'question_answer_notices'];

    public function test_an_answer_is_kept_trimmed_and_the_asker_is_told_once(): void
    {
        $chat = $this->journal->owner()->agent('Planner')->chat('Owner', 'Planner')->chatOf('Owner', 'Planner');
        $questions = $this->journal->fixtures(QuestionFixtures::class)
            ->question('Database', $chat, asker: 'Planner', target: 'Owner')
            ->assertOpen('Database');

        $this->journal->runAs(
            'Owner',
            new AnswerQuestionCommand($questions->questionCalled('Database')->id, ' Postgres. '),
        );

        $questions->assertAnswered('Database', answer: 'Postgres.', by: 'Owner')
            ->assertAnswerNotice('Database', recipient: 'Planner');
    }
}
