<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;
use App\Mcp\Contracts\Continuations;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\DocumentCard;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\ReportCard;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\ReportState;

final readonly class PublicationLists
{
    public function __construct(
        private DocumentResolver $documents,
        private ReportResolver $reports,
        private Continuations $continuations,
    ) {}

    public function documents(ToolArguments $arguments): ToolResult
    {
        $read = $this->position('docs_list', $arguments);
        $page = $this->documents->list($this->filters($read, AttentionFilter::All));

        return $this->page($page->rows, $page->hasNextPage, $read);
    }

    public function reports(ToolArguments $arguments): ToolResult
    {
        $read = $this->position('reports_list', $arguments, $arguments->enumOr('state', ReportState::Open));
        $state = ReportState::from($read->filters['state']);
        $page = $this->reports->list($this->filters($read, $state->attention()));

        return $this->page($page->rows, $page->hasNextPage, $read);
    }

    private function filters(Continuation $read, AttentionFilter $attention): DocumentFilters
    {
        return DocumentFilters::from([
            'attention' => $attention,
            'query' => $read->filters['search'],
            'page' => $read->offset,
            'perPage' => 8,
        ]);
    }

    private function position(string $tool, ToolArguments $arguments, ReportState|null $state = null): Continuation
    {
        $cursor = $arguments->continuation();
        if ($cursor !== null) {
            return $this->continuations->open($cursor, $tool, '');
        }

        return new Continuation($tool, '', [
            'search' => mb_substr($arguments->textOr('search', ''), 0, 200),
            'state' => $state?->value,
        ], $arguments->positiveIntegerOr('page', 1, 1_000_000));
    }

    /** @param list<DocumentCard|ReportCard> $cards */
    private function page(array $cards, bool $hasNext, Continuation $read): ToolResult
    {
        $rows = array_map(fn (DocumentCard|ReportCard $card) => [
            'id' => (int) $card->number,
            'record_id' => $card->id,
            'title' => mb_strcut($card->title, 0, 100),
            'abstract' => mb_strcut($card->abstract, 0, 120),
        ], $cards);
        $next = $hasNext ? [new \App\Mcp\Data\NextAction($read->tool, [
            'continuation' => $this->continuations->issue(new Continuation(
                $read->tool, '', $read->filters, $read->offset + 1,
            )),
        ])] : [];

        return ToolResult::ok(['cards' => $rows, 'page' => $read->offset], $next);
    }
}
