<?php

declare(strict_types=1);

namespace App\Http\Loaders\Shell;

use App\Actors\Contracts\CurrentActor;
use App\Data\Palette\PaletteSourcesData;
use App\Data\Palette\SearchSourcesInput;
use App\Search\Contracts\SearchSources;
use App\Search\Enums\SearchSurface;
use App\Search\Values\SearchReader;

/**
 * A page of the sources the palette's scope picker offers the viewer, which works before two characters are typed.
 */
final readonly class SearchSourcesLoader
{
    public function __construct(private SearchSources $eligibility, private CurrentActor $actors) {}

    public function __invoke(SearchSourcesInput $input): PaletteSourcesData
    {
        $reader = new SearchReader($this->actors->actor(), SearchSurface::Palette);
        $page = $this->eligibility->discover($reader, trim($input->prefix), after: $input->after);

        return PaletteSourcesData::from([
            'prefix' => $page->prefix,
            'sources' => $page->sources,
            'nextAfter' => $page->nextAfter,
        ]);
    }
}
