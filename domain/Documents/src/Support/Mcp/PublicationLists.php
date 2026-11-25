<?php

declare(strict_types=1);

namespace Domain\Documents\Support\Mcp;

use App\Mcp\Contracts\Continuations;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\ToolArguments;
use App\Support\TextPreview;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Enums\AttentionFilter;

final readonly class PublicationLists
{
    public function __construct(
        private DocumentResolver $documents,
        private ReportResolver $reports,
        private Continuations $continuations,
    ) {}

    public function documents(ToolArguments $arguments): ToolResult
    {
        $position = $this->position('docs_list', $arguments);
        $page = $this->documents->list($this->filters($position, AttentionFilter::All));

        return $this->page($page->rows, $page->hasNextPage, $position);
    }

    public function reports(ToolArguments $arguments): ToolResult
    {
        $position = $this->position('reports_list', $arguments, $arguments->enumOr('state', AttentionFilter::Active));
        $state = AttentionFilter::from($position->filters['state']);
        $page = $this->reports->list($this->filters($position, $state));

        return $this->page($page->rows, $page->hasNextPage, $position);
    }

    private function filters(Continuation $position, AttentionFilter $attention): DocumentFilters
    {
        return DocumentFilters::from([
            'attention' => $attention,
            'query' => $position->filters['search'],
            'page' => $position->offset,
            'perPage' => 8,
        ]);
    }

    private function position(string $tool, ToolArguments $arguments, AttentionFilter|null $state = null): Continuation
    {
        $cursor = $arguments->continuation();

        if ($cursor !== null) {
            return $this->continuations->open($cursor, $tool, '');
        }

        $search = $arguments->textOr('search', '');

        if (mb_strlen($search) > 200) {
            throw ToolArgumentInvalid::for('search', 'at most 200 characters');
        }

        return new Continuation($tool, '', [
            'search' => $search,
            'state' => $state?->value,
        ], $arguments->positiveIntegerOr('page', 1, 1_000_000));
    }

    /**
     * @param  list<PublicationCard>  $cards
     */
    private function page(array $cards, bool $hasNext, Continuation $position): ToolResult
    {
        $entries = array_map(fn (PublicationCard $card) => [
            'id' => (int) $card->number,
            'record_id' => $card->id,
            'title' => TextPreview::within($card->title, 100),
            'abstract' => TextPreview::within($card->abstract, 120),
        ], $cards);

        $next = $hasNext ? [new NextAction($position->tool, [
            'continuation' => $this->continuations->issue(new Continuation(
                $position->tool,
                '',
                $position->filters,
                $position->offset + 1,
            )),
        ])] : [];

        return ToolResult::ok([
            'cards' => $entries,
            'page' => $position->offset,
        ], $next);
    }
}
