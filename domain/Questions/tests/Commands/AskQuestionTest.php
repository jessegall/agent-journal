<?php

declare(strict_types=1);

namespace Domain\Questions\Tests\Commands;

use App\Bus\Exceptions\CommandInputInvalid;
use App\Exceptions\InboxUnavailable;
use Domain\Questions\Commands\AskQuestion\AskQuestionCommand;
use Domain\Questions\Enums\QuestionType;
use Domain\Questions\Exceptions\QuestionRefused;
use Domain\Questions\Models\Question;
use Domain\Questions\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestProjects;

/**
 * A chat member asks another an open question or a choice between options, kept with its asker, target and trimmed
 * options; a blank text, a malformed choice, a chat the asker is not in or a target outside it are refused. A question
 * is of the asker's project.
 */
#[TestsCommand(AskQuestionCommand::class)]
final class AskQuestionTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['questions'];

    private string $chatId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Planner')->agent('Stranger')->sharedInbox('Owner', 'Planner')->actAs('Planner');
        $this->chatId = $this->journal->sharedInboxOf('Owner', 'Planner')->id;
    }

    public function test_an_open_question_keeps_its_text_asker_and_target(): void
    {
        $questionId = $this->journal->run($this->ask('Which database?', QuestionType::Open));

        $question = Question::query()->findOrFail($questionId);

        $this->assertSame(
            [
                'Which database?',
                QuestionType::Open,
                $this->journal->agentCalled('Planner')->id,
                $this->journal->ownerUser()->id,
            ],
            [$question->text, $question->type, $question->sender_id, $question->target_id],
        );
    }

    public function test_a_choice_keeps_its_options_trimmed(): void
    {
        $questionId = $this->journal->run(
            $this->ask('Which database?', QuestionType::Choice, [' Postgres ', 'SQLite']),
        );

        $this->assertSame(['Postgres', 'SQLite'], Question::query()->findOrFail($questionId)->options);
    }

    public function test_a_blank_text_an_open_question_with_options_and_a_choice_without_two_options_are_refused(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run($this->ask(' ', QuestionType::Open)),
            CommandInputInvalid::class,
            'text:',
        );

        $this->assertThrows(
            fn () => $this->journal->run($this->ask('Which?', QuestionType::Open, ['A', 'B'])),
            QuestionRefused::class,
            QuestionRefused::openTakesNoOptions()->getMessage(),
        );

        foreach ([
            ['A'],
            [
                'A',
                'A',
            ],
            [
                'A',
                ' ',
            ],
        ] as $options) {
            $this->assertThrows(
                fn () => $this->journal->run($this->ask('Which?', QuestionType::Choice, $options)),
                QuestionRefused::class,
                QuestionRefused::choiceNeedsOptions()->getMessage(),
            );
        }

        $this->assertSame(0, Question::query()->count());
    }

    public function test_a_chat_the_asker_is_not_in_and_a_target_outside_the_chat_are_refused(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run(new AskQuestionCommand(
                $this->chatId,
                $this->journal->actorCalled('Stranger'),
                'Which?',
                QuestionType::Open,
                TestProjects::local()->id,
            )),
            QuestionRefused::class,
            QuestionRefused::targetNotInInbox($this->journal->actorCalled('Stranger'))->getMessage(),
        );

        $this->journal->actAs('Stranger');

        $this->assertThrows(
            fn () => $this->journal->run($this->ask('Which?', QuestionType::Open)),
            InboxUnavailable::class,
        );

        $this->assertSame(0, Question::query()->count());
    }

    public function test_a_question_asked_by_an_agent_of_one_project_is_missing_under_another(): void
    {
        $this->journal->project('A')->project('B')->agent('Shopper', project: 'A')->sharedInbox('Owner', 'Shopper');
        $projectA = $this->journal->projectCalled('A');

        $questionId = $this->journal->actAs('Shopper')->run(new AskQuestionCommand(
            $this->journal->sharedInboxOf('Owner', 'Shopper')->id,
            $this->journal->actorCalled('Owner'),
            'Which database?',
            QuestionType::Open,
            $projectA->id,
        ));

        $this->journal->actAs('Owner')->selectProject('B');
        $this->assertFalse(Question::query()->whereKey($questionId)->exists());
        $this->journal->selectProject('A');
        $this->assertSame($projectA->id, Question::query()->findOrFail($questionId)->project_id);
    }

    /**
     * @param  list<string>  $options
     */
    private function ask(string $text, QuestionType $type, array $options = []): AskQuestionCommand
    {
        return new AskQuestionCommand(
            $this->chatId,
            $this->journal->actorCalled('Owner'),
            $text,
            $type,
            TestProjects::local()->id,
            $options,
        );
    }
}
