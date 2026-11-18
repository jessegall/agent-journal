<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ContinuationInvalid;
use App\Mcp\Exceptions\ContinuationStale;
use Closure;

/**
 * Answers a numbered list tool: a first page read from the tool's filters, or the continuation of a page the byte
 * budget shortened. A shortened page keeps its remaining references and continues with them, read again under the
 * caller's current authorization, before the next numbered page, which is a new live read.
 */
final readonly class NumberedPages
{
    private const string SELECTOR = 'caller';

    public function __construct(
        private ResultBudget $budget,
        private RetainedPages $retained,
        private Continuations $continuations,
    ) {}

    /**
     * @param  Closure(ToolArguments): array<string, mixed>  $filtersOf  the first-page filters, with the page number under page
     * @param  Closure(array<string, mixed>): ListedPage  $read  the owner's reader for those filters
     *
     * @throws ContinuationInvalid
     * @throws ContinuationStale
     */
    public function answer(string $tool, ToolArguments $arguments, Closure $filtersOf, Closure $read): ToolResult
    {
        $cursor = $arguments->continuation();

        if ($cursor === null) {
            $filters = $filtersOf($arguments);
            $page = $read($filters);

            return $this->fit(new Continuation($tool, self::SELECTOR, $filters, 0), $page, RetainedEntries::wholePage($page->cards));
        }

        $continuation = $this->continuations->open($cursor, $tool, self::SELECTOR);
        $retainedPageId = $continuation->retainedPageId ?? throw ContinuationInvalid::unreadable();
        $page = $read($continuation->filters);

        return $this->fit($continuation, $page, $this->retained->resolve($retainedPageId, $continuation->offset, fn (array $references): array => $page->cards));
    }

    /**
     * The cards from the continuation's offset that fit the budget, and the call that goes on: the rest of this page
     * when the budget cut it, else the next numbered page when there is one.
     *
     * @param  RetainedEntries<array<string, mixed>>  $entries
     */
    private function fit(Continuation $continuation, ListedPage $page, RetainedEntries $entries): ToolResult
    {
        $cards = $entries->entries;
        $count = count($cards);

        while ($count > 1 && ! $this->budget->payloadFits($this->payload($page, array_slice($cards, 0, $count), $entries->unavailableCount))) {
            $count--;
        }

        $nextActions = match (true) {
            $count < count($cards) => [$this->rest($continuation, $page, $entries->offsets[array_keys($cards)[$count]])],
            $page->hasNextPage() => [new NextAction($continuation->tool, [...$continuation->filters, 'page' => $page->page + 1])],
            default => [],
        };

        return new ToolResult('ok', $this->payload($page, array_slice($cards, 0, $count), $entries->unavailableCount), $nextActions);
    }

    private function rest(Continuation $continuation, ListedPage $page, int $offset): NextAction
    {
        $retainedPageId = $continuation->retainedPageId ?? $this->retained->keep(array_map(strval(...), array_keys($page->cards)));
        $cursor = $this->continuations->issue(new Continuation($continuation->tool, self::SELECTOR, $continuation->filters, $offset, retainedPageId: $retainedPageId));

        return new NextAction($continuation->tool, ['continuation' => $cursor]);
    }

    /**
     * @param  array<string, array<string, mixed>>  $cards
     * @return array<string, mixed>
     */
    private function payload(ListedPage $page, array $cards, int $unavailableCount): array
    {
        return [
            'cards' => array_values($cards),
            'page' => $page->page,
            'per_page' => $page->perPage,
            'total' => $page->total,
            'unavailable_count' => $unavailableCount,
        ];
    }
}
