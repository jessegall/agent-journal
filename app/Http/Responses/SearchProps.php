<?php

declare(strict_types=1);

namespace App\Http\Responses;

use App\Contracts\CurrentActor;
use App\Contracts\RecordResolver;
use App\Contracts\ServedEnvironment;
use App\Data\PaletteHitData;
use App\Data\PaletteSearchData;
use App\Data\PaletteSourceData;
use App\Data\PaletteSourcesData;
use App\Enums\SearchSurface;
use App\Mcp\Support\DeclaredSearch;
use App\Support\ActorContext;
use App\Support\RecordIdentity;
use App\Support\SearchCoordinator;
use App\Support\SearchEligibility;
use App\Values\DeclaredSearchable;
use App\Values\EmittedHit;
use App\Values\SearchAnswer;
use App\Values\SearchOwner;
use App\Values\SearchReader;
use App\Values\SearchRequest;
use App\Values\SearchWords;
use Illuminate\Http\Request;
use Inertia\ResponseFactory;

/**
 * The keyboard palette's search props, read only when a partial reload asks for them: one search call of the
 * common search service for the signed-in user, bound to the palette, and a page of the sources its scope picker
 * offers, which works before two characters are typed. The agent tool answers the same words with the same hits in
 * the same order for the same access.
 */
final readonly class SearchProps
{
    public const string QUERY = 'searchQuery';

    public const string WITHIN = 'searchWithin';

    public const string LIMIT = 'searchLimit';

    public const string CONTINUATION = 'searchContinuation';

    public const string PREFIX = 'searchPrefix';

    public const string AFTER = 'searchSourcesAfter';

    private const string TOO_SHORT = 'too_short';

    public function __construct(
        private SearchCoordinator $coordinator,
        private SearchEligibility $eligibility,
        private RecordResolver $records,
        private CurrentActor $actors,
        private ServedEnvironment $environment,
        private ResponseFactory $inertia,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function of(Request $request): array
    {
        return [
            'search' => $this->inertia->optional(fn () => $this->search($request)),
            'searchSources' => $this->inertia->optional(fn () => $this->sources($request)),
        ];
    }

    private function search(Request $request): PaletteSearchData
    {
        $continuation = self::textOf($request, self::CONTINUATION);
        $query = self::textOf($request, self::QUERY);

        if ($continuation === null && mb_strlen(trim((string) $query)) < SearchWords::CHARACTER_MINIMUM) {
            return $this->tooShort((string) $query);
        }

        $answer = $this->coordinator->search($this->owner($request), $this->reader(), SearchRequest::parse(
            query: $continuation === null ? $query : null,
            within: $continuation === null ? self::textOf($request, self::WITHIN) : null,
            limit: $request->filled(self::LIMIT) ? $request->integer(self::LIMIT) : null,
            continuation: $continuation,
        ));

        return $this->dataOf($answer);
    }

    private function sources(Request $request): PaletteSourcesData
    {
        $prefix = trim((string) self::textOf($request, self::PREFIX));
        $page = $this->eligibility->discover($this->reader(), $prefix, after: self::textOf($request, self::AFTER));

        return new PaletteSourcesData(
            $page->prefix,
            array_map(fn (DeclaredSearchable $source) => PaletteSourceData::fromDeclared($source), $page->sources),
            $page->nextAfter,
        );
    }

    /**
     * Input too short to search: the hints of the eligible sources, such as Type task 7, and no record query.
     */
    private function tooShort(string $query): PaletteSearchData
    {
        return new PaletteSearchData(
            self::TOO_SHORT,
            [],
            null,
            null,
            $this->eligibility->hints($this->reader(), $query),
            [],
            [],
            'Type at least '.SearchWords::CHARACTER_MINIMUM.' characters to search.',
            null,
        );
    }

    private function dataOf(SearchAnswer $answer): PaletteSearchData
    {
        $shown = $answer->directOpen === null ? $answer->hits : [$answer->directOpen, ...$answer->hits];
        $pages = $this->pagesOf($shown);
        $direct = $answer->directOpen === null ? null : PaletteHitData::of($answer->directOpen, $pages[0] ?? null);
        $hits = [];

        foreach ($answer->hits as $index => $hit) {
            $hits[] = PaletteHitData::of($hit, $pages[$index + ($direct === null ? 0 : 1)] ?? null);
        }

        return new PaletteSearchData(
            $answer->status->value,
            $hits,
            $direct,
            $answer->directOpen === null ? null : "Open {$answer->directOpen->snippet}",
            [],
            $answer->scope === null ? [] : array_map(PaletteSourceData::fromDeclared(...), $answer->scope->sources),
            $answer->narrowerScopes,
            $answer->reason,
            $answer->continuation,
        );
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
        $records = array_map(fn (EmittedHit $hit): RecordIdentity => $hit->reference, $hits);
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

    private function owner(Request $request): SearchOwner
    {
        return new SearchOwner(
            $request->session()->getId(),
            ActorContext::of($this->actors->actor()),
            implode(',', $this->environment->environmentIds()),
            DeclaredSearch::TOOL,
            SearchSurface::Palette,
        );
    }

    private function reader(): SearchReader
    {
        return new SearchReader(ActorContext::of($this->actors->actor()), SearchSurface::Palette);
    }

    private static function textOf(Request $request, string $parameter): string|null
    {
        return $request->filled($parameter) ? $request->string($parameter)->toString() : null;
    }
}
