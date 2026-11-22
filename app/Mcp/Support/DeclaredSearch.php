<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Contracts\ServedEnvironment;
use App\Enums\SearchSurface;
use App\Mcp\Contracts\Continuations as ContinuationsContract;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ContinuationInvalid;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Support\ActorContext;
use App\Support\AgentContext;
use App\Support\SearchCoordinator;
use App\Support\SearchEligibility;
use App\Values\DeclaredSearchable;
use App\Values\EmittedHit;
use App\Values\ScopeResolution;
use App\Values\SearchAnswer;
use App\Values\SearchOwner;
use App\Values\SearchReader;
use App\Values\SearchRequest;

/**
 * The search tool over the sources the domains declare: words with an optional scope and limit, a continuation, or
 * a discovery page of the sources the caller may search. The answer names its status and the one next action.
 */
final readonly class DeclaredSearch
{
    public const string TOOL = 'search';

    private const string DISCOVERY_SELECTOR = 'discover';

    /**
     * The arguments of the search contract that came before, refused with the current ones named.
     */
    public const array RETIRED_ARGUMENTS = ['types', 'page'];

    /**
     * The selector the search contract that came before signed its cursors with.
     */
    private const string OBSOLETE_SELECTOR = '';

    public const string CURRENT_ARGUMENTS = 'query, within, limit, continuation, discover or prefix';

    public function __construct(
        private SearchCoordinator $coordinator,
        private SearchEligibility $eligibility,
        private ContinuationsContract $continuations,
        private AgentContext $agent,
        private ServedEnvironment $environment,
    ) {}

    public function search(ToolArguments $arguments): ToolResult
    {
        foreach (self::RETIRED_ARGUMENTS as $retired) {
            if ($arguments->sent($retired)) {
                throw ToolArgumentInvalid::for($retired, self::CURRENT_ARGUMENTS);
            }
        }

        $continuation = $arguments->optionalText('continuation');

        if ($continuation !== null && self::isSignedCursor($continuation)) {
            return $this->signedCursor($continuation);
        }

        $request = SearchRequest::parse(
            query: $arguments->optionalText('query'),
            within: $arguments->optionalText('within'),
            limit: $arguments->optionalPositiveInteger('limit'),
            continuation: $continuation,
            discover: $arguments->flag('discover'),
            prefix: $arguments->optionalText('prefix'),
        );

        if ($request->isDiscovery()) {
            return $this->discover($request->prefix, $request->limit, null);
        }

        return $this->answer($this->coordinator->search($this->owner(), $this->reader(), $request));
    }

    /**
     * A signed two-part cursor: the next discovery page, or a cursor of the search contract that came before,
     * which answers restart; a cursor not issued to this caller is refused.
     */
    private function signedCursor(string $cursor): ToolResult
    {
        try {
            $read = $this->continuations->open($cursor, self::TOOL, self::DISCOVERY_SELECTOR);
        } catch (ContinuationInvalid) {
            $this->continuations->open($cursor, self::TOOL, self::OBSOLETE_SELECTOR);

            return $this->answer(SearchAnswer::restart());
        }

        return $this->discover(
            (string) $read->filters['prefix'],
            (int) $read->filters['limit'],
            (string) $read->filters['after'],
        );
    }

    private function discover(string $prefix, int $limit, string|null $after): ToolResult
    {
        $page = $this->eligibility->discover($this->reader(), $prefix, $limit, $after);
        $next = [];

        if ($page->hasMore()) {
            $next[] = new NextAction(self::TOOL, ['continuation' => $this->continuations->issue(
                new Continuation(self::TOOL, self::DISCOVERY_SELECTOR, [
                    'prefix' => $prefix,
                    'limit' => $limit,
                    'after' => $page->nextAfter,
                ], 1),
            )]);
        }

        return ToolResult::ok([
            'search_status' => $page->hasMore() ? 'more' : 'complete',
            'prefix' => $prefix,
            'sources' => array_map(fn (DeclaredSearchable $source) => self::sourceOf($source), $page->sources),
        ], $next);
    }

    private function answer(SearchAnswer $answer): ToolResult
    {
        $fields = [
            'search_status' => $answer->status->value,
            'hits' => array_map(fn (EmittedHit $hit) => $hit->toArray(), $answer->hits),
        ];
        $next = [];

        if ($answer->directOpen !== null) {
            $fields['direct_open'] = $answer->directOpen->toArray();
            $next[] = new NextAction($answer->directOpen->open->tool, $answer->directOpen->open->arguments);
        }

        if ($answer->reason !== null) {
            $fields['reason'] = $answer->reason;
        }

        if ($answer->failedSources !== []) {
            $fields['failed_sources'] = $answer->failedSources;
        }

        if ($answer->sourceChoices !== []) {
            $fields['source_choices'] = $answer->sourceChoices;
        }

        if ($answer->scope instanceof ScopeResolution) {
            $fields['alternatives'] = array_map(
                fn (DeclaredSearchable $source) => self::sourceOf($source),
                $answer->scope->sources,
            );
            $next[] = new NextAction(self::TOOL, ScopeResolution::DISCOVERY_ACTION);
        }

        if ($answer->continuation !== null) {
            $next[] = new NextAction(self::TOOL, ['continuation' => $answer->continuation]);
        }

        foreach ($answer->narrowerSearches() as $arguments) {
            $next[] = new NextAction(self::TOOL, $arguments);
        }

        return ToolResult::ok($fields, $next);
    }

    /**
     * @return array{key: string, label: string, display: string}
     */
    private static function sourceOf(DeclaredSearchable $source): array
    {
        return ['key' => $source->qualifiedKey, 'label' => $source->label(), 'display' => $source->display()];
    }

    private function owner(): SearchOwner
    {
        return new SearchOwner(
            $this->agent->sessionId,
            ActorContext::forAgent($this->agent->agentId),
            implode(',', $this->environment->environmentIds()),
            self::TOOL,
            SearchSurface::AgentTool,
        );
    }

    private function reader(): SearchReader
    {
        return new SearchReader(ActorContext::forAgent($this->agent->agentId), SearchSurface::AgentTool);
    }

    /**
     * A signed continuation has two parts; a search handle has three.
     */
    private static function isSignedCursor(string $continuation): bool
    {
        return substr_count($continuation, '.') === 1;
    }
}
