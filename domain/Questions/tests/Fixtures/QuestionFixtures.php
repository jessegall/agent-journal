<?php

declare(strict_types=1);

namespace Domain\Questions\Tests\Fixtures;

use App\Models\Inboxes\Inbox;
use Domain\Questions\Enums\QuestionType;
use Domain\Questions\Models\Question;
use Domain\Questions\Models\QuestionAnswerNotice;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\FixtureAliases;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * Questions one named user or agent asks another in an inbox, kept under the names a test gives them, and what became
 * of them: still open, answered by whom, and the notice the asker was given.
 */
final class QuestionFixtures
{
    private readonly FixtureAliases $aliases;

    public function __construct(private readonly TestJournal $journal)
    {
        $this->aliases = new FixtureAliases('QuestionFixtures');
    }

    /**
     * @param  list<string>  $options
     */
    public function question(
        string $name,
        Inbox $inbox,
        string $asker,
        string $target,
        string $prompt = 'Which database?',
        QuestionType $type = QuestionType::Open,
        array $options = [],
    ): self {
        $this->aliases->claim($name);
        $sender = $this->journal->actorCalled($asker);

        $question = Question::create(
            TestProjects::ownerOf($this->journal->userOrAgentCalled($asker)),
            $inbox->id,
            $sender,
            $this->journal->actorCalled($target),
            $prompt,
            $type,
            $options,
        );

        $this->aliases->remember($name, $question);

        return $this;
    }

    /**
     * The question the naming verb makes, given back at once instead of read back by its name.
     *
     * @param  list<string>  $options
     */
    public function createQuestion(
        string $name,
        Inbox $inbox,
        string $asker,
        string $target,
        string $prompt = 'Which database?',
        QuestionType $type = QuestionType::Open,
        array $options = [],
    ): Question {
        return $this->question($name, $inbox, $asker, $target, $prompt, $type, $options)->questionCalled($name);
    }

    public function questionCalled(string $name): Question
    {
        return $this->aliases->model(Question::class, $name);
    }

    public function assertOpen(string $name): self
    {
        $question = $this->questionCalled($name);

        Assert::assertSame([null, null], [$question->answer, $question->answered_at], "{$name} was answered.");

        return $this;
    }

    /**
     * The question holds this answer from its target, the named user or agent, and the time it was given.
     */
    public function assertAnswered(string $name, string $answer, string $by): self
    {
        $question = $this->questionCalled($name);
        $target = $this->journal->actorCalled($by);

        Assert::assertSame(
            [$target->type, $target->id, $answer],
            [$question->target_type, $question->target_id, $question->answer],
            "{$name} was answered otherwise.",
        );

        Assert::assertNotNull($question->answered_at, "{$name} has no answer time.");

        return $this;
    }

    /**
     * The named user or agent was given exactly one notice of the answer, and it was delivered.
     */
    public function assertAnswerNotice(string $name, string $recipient): self
    {
        $to = $this->journal->actorCalled($recipient);

        $notices = QuestionAnswerNotice::query()
            ->where('question_id', $this->questionCalled($name)->id)
            ->where('recipient_type', $to->type)
            ->where('recipient_id', $to->id)
            ->get();

        Assert::assertCount(1, $notices, "{$recipient} was not given one notice of the answer to {$name}.");

        Assert::assertNotNull(
            $notices->sole()->delivered_at,
            "The notice of {$name} to {$recipient} was not delivered.",
        );

        return $this;
    }
}
