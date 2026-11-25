<?php

declare(strict_types=1);

namespace Tests\Reads\Shell;

use App\Data\Palette\PaletteSearchData;
use App\Data\Palette\SearchInput;
use App\Http\Loaders\Shell\SearchLoader;
use Illuminate\Validation\ValidationException;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\TestCase;

/**
 * The palette's search for the owner: words too short give hints and no query, accented words are searched, words
 * that match nothing answer with no hits, and the limit keeps its bound.
 */
#[TestsRead(SearchLoader::class)]
final class SearchLoaderTest extends TestCase
{
    public function test_words_too_short_give_hints_and_no_hits(): void
    {
        $this->journal->owner();

        $answer = $this->read(['query' => 'é']);

        $this->assertSame(['too_short', []], [$answer->status, $answer->hits]);
    }

    public function test_accented_words_that_match_nothing_are_searched_and_answer_no_hits(): void
    {
        $this->journal->owner();

        $answer = $this->read(['query' => 'crème brûlée zzqx']);

        $this->assertNotSame('too_short', $answer->status);
        $this->assertSame([], $answer->hits);
    }

    public function test_a_limit_below_one_is_refused(): void
    {
        $this->expectException(ValidationException::class);

        SearchInput::validateAndCreate(['query' => 'plans', 'limit' => 0]);
    }

    /**
     * @param  array<string, mixed>  $input
     */
    private function read(array $input): PaletteSearchData
    {
        return $this->app->make(SearchLoader::class)(SearchInput::validateAndCreate($input));
    }
}
