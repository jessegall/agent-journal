<?php

declare(strict_types=1);

namespace Domain\Questions\Tests\Commands;

use Domain\Questions\Commands\ReadQuestion\ReadQuestionCommand;
use Domain\Questions\Exceptions\QuestionRefused;
use Domain\Questions\Models\Question;
use Domain\Questions\Tests\Fixtures\QuestionFixtures;
use Domain\Questions\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * The asker and the target of a question read it; anyone else is refused.
 */
final class ReadQuestionTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['questions'];

    private Question $question;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Planner')->agent('Stranger')->chat('Owner', 'Planner');
        $this->question = $this->journal->fixtures(QuestionFixtures::class)
            ->question('Database', $this->journal->chatOf('Owner', 'Planner'), 'Planner', 'Owner')
            ->questionCalled('Database');
    }

    public function test_the_asker_and_the_target_read_the_question(): void
    {
        $this->assertSame('Which database?', $this->journal->run(new ReadQuestionCommand($this->question->id))->text);

        $this->journal->actAs('Planner');
        $this->assertSame('Which database?', $this->journal->run(new ReadQuestionCommand($this->question->id))->text);
    }

    public function test_anyone_else_is_refused(): void
    {
        $this->journal->actAs('Stranger');

        $this->assertThrows(
            fn () => $this->journal->run(new ReadQuestionCommand($this->question->id)),
            QuestionRefused::class,
            QuestionRefused::notInvolved($this->question->id)->getMessage(),
        );
    }
}
