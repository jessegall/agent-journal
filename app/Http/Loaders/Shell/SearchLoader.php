<?php

declare(strict_types=1);

namespace App\Http\Loaders\Shell;

use App\Actors\Contracts\CurrentActor;
use App\Data\Palette\PaletteHitData;
use App\Data\Palette\PaletteSearchData;
use App\Data\Palette\SearchInput;
use App\Hosts\Contracts\ServedEnvironment;
use App\Mcp\Support\DeclaredSearch;
use App\Projects\Contracts\CurrentProject;
use App\Records\Contracts\RecordResolver;
use App\Search\Contracts\RecordSearch;
use App\Search\Contracts\SearchSources;
use App\Search\Enums\SearchSurface;
use App\Search\Exceptions\SearchWordsInvalid;
use App\Search\Values\DeclaredSearchable;
use App\Search\Values\EmittedHit;
use App\Search\Values\SearchAnswer;
use App\Search\Values\SearchOwner;
use App\Search\Values\SearchReader;
use App\Search\Values\SearchRequest;
use App\Search\Values\SearchWords;
use Illuminate\Contracts\Session\Session;

/**
 * The keyboard palette's search: one call of the common search service for the viewer, bound to the palette, with
 * each hit's page; words too short to search give the hints of the eligible sources. The agent tool answers the same
 * words with the same hits in the same order for the same access.
 */
final readonly class SearchLoader
{
    private const string TOO_SHORT = 'too_short';

    public function __construct(
        private RecordSearch $coordinator,
        private SearchSources $eligibility,
        private RecordResolver $records,
        private CurrentActor $actors,
        private ServedEnvironment $environment,
        private Session $session,
        private CurrentProject $projects,
    ) {}

    public function __invoke(SearchInput $input): PaletteSearchData
    {
        if ($input->continuation === null && mb_strlen(trim((string) $input->query)) < SearchWords::CHARACTER_MINIMUM) {
            return $this->tooShort((string) $input->query);
        }

        $answer = $this->coordinator->search($this->owner(), $this->reader(), SearchRequest::parse(
            query: $input->continuation === null ? $input->query : null,
            within: $input->continuation === null ? $input->within : null,
            limit: $input->limit,
            continuation: $input->continuation,
        ));

        return $this->dataOf($answer);
    }

    /**
     * Input too short to search: the hints of the eligible sources, such as Type task 7, and no record query.
     */
    private function tooShort(string $query): PaletteSearchData
    {
        return PaletteSearchData::from([
            'status' => self::TOO_SHORT,
            'hits' => [],
            'directOpenLabel' => null,
            'hints' => $this->eligibility->hints($this->reader(), $query),
            'alternatives' => [],
            'narrowerScopes' => [],
            'reason' => SearchWordsInvalid::tooShort(SearchWords::CHARACTER_MINIMUM)->getMessage(),
            'continuation' => null,
        ]);
    }

    private function dataOf(SearchAnswer $answer): PaletteSearchData
    {
        $shown = $answer->directOpen === null ? $answer->hits : [
            $answer->directOpen,
            ...$answer->hits,
        ];

        $pages = $this->pagesOf($shown);
        $direct = $answer->directOpen === null ? null : PaletteHitData::of($answer->directOpen, $pages[0] ?? null);
        $hits = [];

        foreach ($answer->hits as $index => $hit) {
            $hits[] = PaletteHitData::of($hit, $pages[$index + ($direct === null ? 0 : 1)] ?? null);
        }

        $fields = [
            'status' => $answer->status->value,
            'hits' => $hits,
            'directOpenLabel' => $answer->directOpen === null ? null : "Open {$answer->directOpen->snippet}",
            'hints' => [],
            'alternatives' => $answer->scope === null ? [] : $answer->scope->sources,
            'narrowerScopes' => $answer->narrowerScopes,
            'reason' => $answer->reason,
            'continuation' => $answer->continuation,
        ];

        if ($direct !== null) {
            $fields['directOpen'] = $direct;
        }

        return PaletteSearchData::from($fields);
    }

    /**
     * The page of each shown hit, by its position: the record's page with the query that opens it at the hit's
     * location, read for all the hits' records in one batch; none for a record without a page.
     *
     * @param  list<EmittedHit>  $hits
     * @return array<int, string|null>
     */
    private function pagesOf(array $hits): array
    {
        $records = array_map(fn (EmittedHit $hit) => $hit->reference, $hits);
        $routes = [];

        foreach ($this->records->visibleCards($records) as $card) {
            $routes["{$card->type}\0{$card->id}"] = $card->route;
        }

        $pages = [];

        foreach ($hits as $index => $hit) {
            $route = $routes["{$hit->reference->type}\0{$hit->reference->id}"] ?? null;
            $query = $this->eligibility->access($this->sourceOf($hit))->pageQuery($hit->location);
            $pages[$index] = $route === null || $query === [] ? $route : $route.'?'.http_build_query($query);
        }

        return $pages;
    }

    private function sourceOf(EmittedHit $hit): DeclaredSearchable
    {
        return $this->eligibility->source($this->reader(), $hit->sourceKey);
    }

    private function owner(): SearchOwner
    {
        return new SearchOwner(
            $this->session->getId(),
            $this->actors->actor(),
            implode(',', $this->environment->environmentIds()),
            $this->projects->selection()->key(),
            DeclaredSearch::TOOL,
            SearchSurface::Palette,
        );
    }

    private function reader(): SearchReader
    {
        return new SearchReader($this->actors->actor(), SearchSurface::Palette);
    }
}
