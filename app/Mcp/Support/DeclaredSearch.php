<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Contracts\ServedEnvironment;
use App\Enums\SearchSurface;
use App\Mcp\Contracts\Continuations as ContinuationsContract;
use App\Mcp\Contracts\SearchEntry;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
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
use Illuminate\Contracts\JsonSchema\JsonSchema;

/**
 * The search tool over the sources the domains declare: words with an optional scope and limit, a continuation, or
 * a discovery page of the sources the caller may search. The answer names its status and the one next action.
 */
final readonly class DeclaredSearch implements SearchEntry
{
    private const string DISCOVERY_SELECTOR = 'discover';

    public function __construct(
        private SearchCoordinator $coordinator,
        private SearchEligibility $eligibility,
        private ContinuationsContract $continuations,
        private AgentContext $agent,
        private ServedEnvironment $environment,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'query' => $schema->string(),
            'within' => $schema->string()->max(200),
            'limit' => $schema->integer()->min(1)->max(SearchRequest::LIMIT_MAXIMUM),
            'continuation' => $schema->string(),
            'discover' => $schema->boolean(),
            'prefix' => $schema->string()->max(64),
        ];
    }

    public function description(): string
    {
        return 'Search records and passages.';
    }

    public function search(ToolArguments $arguments): ToolResult
    {
        $continuation = $arguments->optionalText('continuation');

        if ($continuation !== null && self::isDiscoveryCursor($continuation)) {
            $read = $this->continuations->open($continuation, JournalSearch::TOOL, self::DISCOVERY_SELECTOR);

            return $this->discover(
                (string) $read->filters['prefix'],
                (int) $read->filters['limit'],
                (string) $read->filters['after'],
            );
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

    private function discover(string $prefix, int $limit, string|null $after): ToolResult
    {
        $page = $this->eligibility->discover($this->reader(), $prefix, $limit, $after);
        $next = [];

        if ($page->hasMore()) {
            $next[] = new NextAction(JournalSearch::TOOL, ['continuation' => $this->continuations->issue(
                new Continuation(JournalSearch::TOOL, self::DISCOVERY_SELECTOR, [
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

        if ($answer->sourceChoices !== []) {
            $fields['source_choices'] = $answer->sourceChoices;
        }

        if ($answer->scope instanceof ScopeResolution) {
            $fields['alternatives'] = array_map(
                fn (DeclaredSearchable $source) => self::sourceOf($source),
                $answer->scope->sources,
            );
            $next[] = new NextAction(JournalSearch::TOOL, ScopeResolution::DISCOVERY_ACTION);
        }

        if ($answer->continuation !== null) {
            $next[] = new NextAction(JournalSearch::TOOL, ['continuation' => $answer->continuation]);
        }

        foreach ($answer->narrowerSearches() as $arguments) {
            $next[] = new NextAction(JournalSearch::TOOL, $arguments);
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
            JournalSearch::TOOL,
            SearchSurface::AgentTool,
        );
    }

    private function reader(): SearchReader
    {
        return new SearchReader(ActorContext::forAgent($this->agent->agentId), SearchSurface::AgentTool);
    }

    /**
     * A discovery cursor is a signed continuation of two parts; a search handle has three.
     */
    private static function isDiscoveryCursor(string $continuation): bool
    {
        return substr_count($continuation, '.') === 1;
    }
}
