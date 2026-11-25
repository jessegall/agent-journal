<?php

declare(strict_types=1);

namespace Tests\Reads\Shell;

use App\Data\Palette\SearchSourcesInput;
use App\Http\Loaders\Shell\SearchSourcesLoader;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\TestCase;

/**
 * The sources the palette's scope picker offers the owner, before any word is typed and by a prefix.
 */
#[TestsRead(SearchSourcesLoader::class)]
final class SearchSourcesLoaderTest extends TestCase
{
    public function test_the_picker_offers_sources_before_a_word_is_typed_and_by_their_prefix(): void
    {
        $this->journal->owner();
        $loader = $this->app->make(SearchSourcesLoader::class);

        $all = $loader(SearchSourcesInput::validateAndCreate([]));
        $none = $loader(SearchSourcesInput::validateAndCreate(['prefix' => 'zzqx']));

        $this->assertSame('', $all->prefix);
        $this->assertSame(['zzqx', []], [$none->prefix, $none->sources]);
    }
}
