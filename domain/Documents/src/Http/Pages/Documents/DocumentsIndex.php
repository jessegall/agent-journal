<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Documents;

use App\Contracts\Navigation\DraftProducers;
use App\Contracts\Navigation\RecordMenus;
use App\Enums\ActionMethod;
use App\Http\Pages\CreationDialog;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPage;
use App\Support\Layout\ListPaging;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Data\PublicationList;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\LibraryTypeFilter;
use Spatie\LaravelData\Optional;

/**
 * The library on the shared list recipe: who sees its records, the search over titles, abstracts and text, the type and
 * attention choices, then its records by number, each opening its own page, a way to the next page and a dialog to file
 * a document or a report. A library with nothing to show says whether the search or a fresh journal is why, and offers
 * to clear the search or to file the first document.
 */
final readonly class DocumentsIndex extends DocumentsPage
{
    public function __construct(private RecordMenus $menus, private DraftProducers $producers) {}

    public function of(
        DocumentFilters $filters,
        LibraryTypeFilter $type,
        PublicationList|null $documents,
        PublicationList|null $reports,
        LayoutPartData ...$reader,
    ): DeclaredLayoutData {
        $rows = [
            ...($documents === null ? [] : $this->rowsOf($documents, 'doc', 'docs', true)),
            ...($reports === null ? [] : $this->rowsOf($reports, 'report', 'reports', false)),
        ];

        return ListPage::make('Documents', $rows, $this->emptyFor($filters))
            ->searching(
                'Search documents',
                LayoutFieldData::from([
                    'name' => 'query',
                    'value' => $filters->query,
                    'clears' => [
                        'after',
                        'page',
                    ],
                ]),
            )
            ->creatingWith($this->creation('doc', 'New document'), $this->creation('report', 'New report'))
            ->paged(ListPaging::cursor($type === LibraryTypeFilter::All ? null : $this->nextOf($documents ?? $reports)))
            ->withReader(LayoutBackData::from([
                'href' => '/documents',
                'label' => 'Documents',
            ]), ...$reader)
            ->layout();
    }

    /**
     * @return list<LayoutRowData>
     */
    private function rowsOf(PublicationList $list, string $label, string $path, bool $hasMenu): array
    {
        return array_map(fn (PublicationCard $card) => LayoutRowData::from([
            'key' => $card->id,
            'label' => "{$label} {$card->number} · {$card->title}",
            'value' => $card->attention->value,
            'detail' => $card->summaryLine(),
            'href' => "/documents/{$path}/{$card->number}",
            'menu' => $hasMenu
                ? $this->menus->onRecord(DocumentsDomain::DOCUMENT_ACTIONS, $card->number)
                : Optional::create(),
        ]), $list->rows);
    }

    private function nextOf(PublicationList|null $list): string|null
    {
        return $list?->next;
    }

    /**
     * The empty state: a search or attention filter that matched nothing offers to clear it; a fresh library offers to
     * file its first document.
     */
    private function emptyFor(DocumentFilters $filters): ListEmpty
    {
        if ($filters->searches() || $filters->attention !== AttentionFilter::Active) {
            return $this->nothingMatches(
                $filters->searches() ? "Nothing matches \"{$filters->query}\"." : 'Nothing matches this filter.',
                'Clear search',
                [
                    'query' => '',
                    'attention' => AttentionFilter::Active->value,
                    'after' => '',
                ],
            );
        }

        return ListEmpty::nothingYet(
            'No documents yet',
            'Designs, plans and notes that you and the agents write are kept here.',
            'docs',
            $this->creation('doc', 'New document', 'first', 'primary'),
        );
    }

    /**
     * A dialog that files a document or a report from its Title, One line about it and Text, sent to the registered
     * create action of its type.
     */
    private function creation(
        string $type,
        string $label,
        string $key = 'create',
        string $openerStyle = 'bordered',
    ): LayoutPartData {
        $route = $type === 'doc' ? 'documents.create-document' : 'documents.create-report';
        $guidedNoun = $this->guidedNounOf($type);

        $creation = new CreationDialog(
            "{$key}-{$type}",
            $label,
            $type === 'doc' ? 'Document filed' : 'Report filed',
            $type === 'doc' ? 'Create document' : 'Create report',
            $guidedNoun,
            waysInHeader: $key === 'create',
        );

        return $this->creationDialog(
            $creation,
            LayoutPartData::action('open', $label, LayoutActionData::changing([]), $openerStyle),
            LayoutFormData::from([
                'method' => ActionMethod::Post,
                'href' => route($route, [], false),
            ]),
            [
                LayoutPartData::field('title', 'Title', LayoutFieldData::from(['name' => 'title']), 'text'),
                LayoutPartData::field(
                    'abstract',
                    'One line about it',
                    LayoutFieldData::from(['name' => 'abstract']),
                    'text',
                ),
                LayoutPartData::field('body', 'Text', LayoutFieldData::from(['name' => 'body']), 'area'),
            ],
        );
    }

    /**
     * Guided entry for a document when a draft producer is registered for documents; a report is never drafted.
     */
    private function guidedNounOf(string $type): string|Optional
    {
        if ($type === 'doc' && $this->producers->offersGuided('document')) {
            return 'document';
        }

        return Optional::create();
    }
}
