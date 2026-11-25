<?php

declare(strict_types=1);

namespace Tests\Reads\Drafts;

use App\Data\Drafts\DraftAnswersInput;
use App\Http\Loaders\Drafts\DraftRecordLoader;
use App\Support\DraftProducers;
use Illuminate\Validation\ValidationException;
use Tests\Fixtures\ClientDeclarations\StubDraftProducer;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\TestCase;

/**
 * The producer of a noun drafts a record from the caller's three answers, each up to 2000 characters of any script;
 * a fourth answer or a longer one is refused before it runs.
 */
#[TestsRead(DraftRecordLoader::class)]
final class DraftRecordLoaderTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(DraftProducers::class)->register('note', StubDraftProducer::class);
    }

    public function test_three_accented_answers_of_2000_characters_draft_a_record(): void
    {
        $answer = str_repeat('é', 2000);

        $drafted = $this->app->make(DraftRecordLoader::class)(
            DraftAnswersInput::validateAndCreate(['noun' => 'note', 'answers' => [$answer, $answer, $answer]]),
        );

        $this->assertSame(['title' => $answer], $drafted->fields);
        $this->assertSame(StubDraftProducer::AGENT, $drafted->agent);
    }

    public function test_a_fourth_answer_is_refused(): void
    {
        $this->expectException(ValidationException::class);

        DraftAnswersInput::validateAndCreate(['noun' => 'note', 'answers' => ['a', 'b', 'c', 'd']]);
    }

    public function test_an_answer_of_2001_characters_is_refused(): void
    {
        $this->expectException(ValidationException::class);

        DraftAnswersInput::validateAndCreate(['noun' => 'note', 'answers' => ['a', 'b', str_repeat('é', 2001)]]);
    }
}
