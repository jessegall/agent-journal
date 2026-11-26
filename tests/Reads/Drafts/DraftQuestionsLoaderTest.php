<?php

declare(strict_types=1);

namespace Tests\Reads\Drafts;

use App\Exceptions\DraftProducerMissing;
use App\Http\Loaders\Drafts\DraftQuestionsLoader;
use App\Messages\Data\DraftQuestionsData;
use App\Support\DraftProducers;
use App\Web\Drafts\Data\DraftQuestionsInput;
use Tests\Fixtures\ClientDeclarations\StubDraftProducer;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The questions of the draft producer of a noun; a noun with none is unavailable.
 */
#[TestsRead(DraftQuestionsLoader::class)]
final class DraftQuestionsLoaderTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_producers_questions_are_its_answer(): void
    {
        $this->app->make(DraftProducers::class)->register('note', StubDraftProducer::class);

        $answer = $this->read('note');

        $this->assertSame(
            ['Question 1', 'Question 2', 'Question 3'],
            array_column($answer->toArray()['questions'], 'prompt'),
        );
    }

    public function test_a_noun_with_no_producer_is_unavailable(): void
    {
        $this->expectException(DraftProducerMissing::class);

        $this->read('nothing');
    }

    private function read(string $noun): DraftQuestionsData
    {
        return $this->app->make(DraftQuestionsLoader::class)(DraftQuestionsInput::validateAndCreate(['noun' => $noun]));
    }
}
