<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;
use App\Mcp\Contracts\Continuations;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Data\DocumentCard;
use Domain\Documents\Data\ReportCard;
use Domain\Documents\Enums\ReportState;

final readonly class PublicationLists
{
    public function __construct(
        private DocumentReader $documents,
        private ReportReader $reports,
        private Continuations $continuations,
    ) {}

    public function documents(ToolArguments $arguments): ToolResult
    {
        $position = $this->position('docs_list', $arguments);
        $page = $this->documents->list($position->filters['search'], $position->offset);

        return $this->page($page->rows, $page->hasNextPage, $position);
    }

    public function reports(ToolArguments $arguments): ToolResult
    {
        $position = $this->position('reports_list', $arguments, $arguments->enumOr('state', ReportState::Open));
        $page = $this->reports->list($position->filters['search'], ReportState::from($position->filters['state']), $position->offset);

        return $this->page($page->rows, $page->hasNextPage, $position);
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
    private function page(array $cards, bool $hasNext, Continuation $position): ToolResult
    {
        $entries = array_map(fn (DocumentCard|ReportCard $card): array => [
            'id' => (int) $card->number,
            'record_id' => $card->id,
            'title' => mb_strcut($card->title, 0, 100),
            'abstract' => mb_strcut($card->abstract, 0, 120),
        ], $cards);
        $next = $hasNext ? [new \App\Mcp\Data\NextAction($position->tool, [
            'continuation' => $this->continuations->issue(new Continuation(
                $position->tool, '', $position->filters, $position->offset + 1,
            )),
        ])] : [];

        return ToolResult::ok(['cards' => $entries, 'page' => $position->offset], $next);
    }
}
