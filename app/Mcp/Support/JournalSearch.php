<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Agents\Support\ReadGrant;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\SearchHit;
use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use Illuminate\Contracts\Container\Container;

final readonly class JournalSearch
{
    public const string TOOL = 'search';

    public function __construct(
        private McpCatalogue $catalogue,
        private Container $container,
        private Continuations $continuations,
        private ReadGrant $reads,
    ) {}

    public function search(ToolArguments $arguments): ToolResult
    {
        $classes = $this->catalogue->searchContributionClasses();
        $cursor = $arguments->continuation();
        $read = $cursor === null
            ? $this->firstPage($arguments, array_keys($classes))
            : $this->continuations->open($cursor, self::TOOL, '');
        $hits = [];
        $unavailable = [];
        $more = [];
        $next = [];
        foreach ($read->filters['types'] as $type) {
            if (! isset($classes[$type])) {
                $unavailable[] = $type;

                continue;
            }

            $area = $this->container->make($classes[$type]);
            if (! $this->reads->allows($area->readRequest())) {
                $unavailable[] = $type;

                continue;
            }

            $page = $area->search($read->filters['query'], $read->offset);
            array_push($hits, ...array_map(fn (SearchHit $hit) => $hit->card(), $page->hits));
            if ($page->hasNextPage) {
                $more[] = $type;
                $next[] = $this->next($read, $type);
            }
        }

        return ToolResult::ok([
            'hits' => $hits,
            'unavailable_types' => $unavailable,
            'types_with_more' => $more,
        ], $next);
    }

    /**
     * @param list<string> $registered
     */
    private function firstPage(ToolArguments $arguments, array $registered): Continuation
    {
        $query = trim($arguments->text('query'));
        if (mb_strlen($query) < 2 || mb_strlen($query) > 200) {
            throw ToolArgumentInvalid::for('query', '2 to 200 characters');
        }

        $types = array_values(array_unique($arguments->optionalList('types')));
        if (count($types) > 12 || array_any($types, fn (string $type): bool => strlen($type) > 64)) {
            throw ToolArgumentInvalid::for('types', 'at most twelve record types of at most 64 bytes each');
        }

        return new Continuation(self::TOOL, '', [
            'query' => $query,
            'types' => $types === [] ? $registered : $types,
        ], $arguments->positiveIntegerOr('page', 1, 1_000_000));
    }

    private function next(Continuation $read, string $type): NextAction
    {
        return new NextAction(self::TOOL, ['continuation' => $this->continuations->issue(new Continuation(
            self::TOOL,
            '',
            ['query' => $read->filters['query'], 'types' => [$type]],
            $read->offset + 1,
        ))]);
    }
}
