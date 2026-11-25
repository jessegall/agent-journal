<?php

declare(strict_types=1);

namespace Domain\Questions\Tests\Commands;

use App\Exceptions\CommandInputInvalid;
use Domain\Questions\Commands\AnswerQuestion\AnswerQuestionCommand;
use Domain\Questions\Enums\QuestionType;
use Domain\Questions\Exceptions\QuestionRefused;
use Domain\Questions\Models\Question;
use Domain\Questions\Models\QuestionAnswerNotice;
use Domain\Questions\Tests\Fixtures\QuestionFixtures;
use Domain\Questions\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * The target of a question answers it once: the answer is kept trimmed with its time and the asking agent's running
 * session is told; a blank answer, an answer from anyone else, a second answer and a choice answered outside its
 * options are refused and keep the question as it was.
 */
final class AnswerQuestionTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['questions'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Planner')->chat('Owner', 'Planner');
    }

    public function test_the_target_answers_and_the_answer_is_kept_trimmed_with_its_time(): void
    {
        $question = $this->asked(QuestionType::Open);

        $this->journal->run(new AnswerQuestionCommand($question->id, ' Postgres. '));

        $this->assertSame('Postgres.', $question->refresh()->answer);
        $this->assertNotNull($question->answered_at);
    }

    public function test_the_asking_agents_running_session_is_told_of_the_answer_once_it_is_kept(): void
    {
        $question = $this->asked(QuestionType::Open);

        $this->journal->run(new AnswerQuestionCommand($question->id, 'Postgres.'));

        $notice = QuestionAnswerNotice::query()->where('question_id', $question->id)->sole();
        $this->assertSame($this->journal->agentCalled('Planner')->id, $notice->recipient_id);
        $this->assertNotNull($notice->delivered_at);
    }

    public function test_a_blank_answer_an_answer_from_the_asker_and_a_second_answer_are_refused(): void
    {
        $question = $this->asked(QuestionType::Open);

        $this->assertThrows(
            fn () => $this->journal->run(new AnswerQuestionCommand($question->id, ' ')),
            CommandInputInvalid::class,
            'answer:',
        );

        $this->journal->actAs('Planner');

        $this->assertThrows(
            fn () => $this->journal->run(new AnswerQuestionCommand($question->id, 'Myself.')),
            QuestionRefused::class,
            QuestionRefused::notTheTarget($question->id)->getMessage(),
        );

        $this->journal->actAs('Owner');
        $this->journal->run(new AnswerQuestionCommand($question->id, 'Postgres.'));

        $this->assertThrows(
            fn () => $this->journal->run(new AnswerQuestionCommand($question->id, 'SQLite.')),
            QuestionRefused::class,
            QuestionRefused::alreadyAnswered($question->id)->getMessage(),
        );

        $this->assertSame('Postgres.', $question->refresh()->answer);
    }

    public function test_a_choice_answered_outside_its_options_is_refused(): void
    {
        $question = $this->asked(QuestionType::Choice, [
            'Postgres',
            'SQLite',
        ]);

        $this->assertThrows(
            fn () => $this->journal->run(new AnswerQuestionCommand($question->id, 'MySQL')),
            QuestionRefused::class,
            QuestionRefused::notAnOption($question->id)->getMessage(),
        );

        $this->assertNull($question->refresh()->answer);
    }

    /**
     * @param  list<string>  $options
     */
    private function asked(QuestionType $type, array $options = []): Question
    {
        return $this->journal->fixtures(QuestionFixtures::class)
            ->question(
                'Database',
                $this->journal->chatOf('Owner', 'Planner'),
                'Planner',
                'Owner',
                type: $type,
                options: $options,
            )
            ->questionCalled('Database');
    }
}
