<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Documents;

use App\Contracts\Navigation\RecordMenus;
use App\Enums\ActionMethod;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutDialogData;
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

/**
 * The library on the shared list recipe: who sees its records, the search over titles, abstracts and text, the type and
 * attention choices, then its records by number, each opening its own page, a way to the next page and a dialog to file
 * a document or a report. A library with nothing to show says whether the search or a fresh journal is why, and offers
 * to clear the search or to file the first document.
 */
final readonly class DocumentsIndex
{
    public function __construct(private RecordMenus $menus) {}

    public function of(
        DocumentFilters $filters,
        LibraryTypeFilter $type,
        PublicationList|null $documents,
        PublicationList|null $reports,
    ): DeclaredLayoutData {
        $rows = [
            ...($documents === null ? [] : $this->rowsOf($documents, 'doc', 'docs', true)),
            ...($reports === null ? [] : $this->rowsOf($reports, 'report', 'reports', false)),
        ];

        return ListPage::make('Documents', $rows, $this->emptyFor($filters))
            ->searching('Search documents', new LayoutFieldData('query', $filters->query, ['after', 'page']))
            ->creatingWith($this->creation('doc', 'New document'), $this->creation('report', 'New report'))
            ->paged(ListPaging::cursor($type === LibraryTypeFilter::All ? null : $this->nextOf($documents ?? $reports)))
            ->withReader(new LayoutBackData('/documents', 'Documents'))
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
            ...($hasMenu
                ? ['menu' => $this->menus->onRecord(DocumentsDomain::DOCUMENT_ACTIONS, $card->number)]
                : []),
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
            return ListEmpty::offering(
                $filters->searches() ? "Nothing matches \"{$filters->query}\"." : 'Nothing matches this filter.',
                LayoutPartData::action(
                    'clear',
                    'Clear search',
                    LayoutActionData::changing([
                        'query' => '',
                        'attention' => AttentionFilter::Active->value,
                        'after' => '',
                    ]),
                ),
            );
        }

        return ListEmpty::informing(
            'No documents or reports yet.',
            'A document is lasting knowledge kept as revisions; a report says what was checked or found, once.',
        );
    }

    /**
     * A dialog that files a document or a report from its Title, One line about it and Text, sent to the registered
     * create action of its kind.
     */
    private function creation(string $kind, string $label, string $key = ''): LayoutPartData
    {
        $route = $kind === 'doc' ? 'documents.create-document' : 'documents.create-report';

        return LayoutPartData::dialog(
            $key === '' ? "create-{$kind}" : $key,
            new LayoutDialogData($label, $kind === 'doc' ? 'Document filed' : 'Report filed'),
            LayoutPartData::action('open', $label, LayoutActionData::changing([]), 'bordered'),
            new LayoutFormData(ActionMethod::Post, route($route, [], false)),
            [
                LayoutPartData::field('title', 'Title', new LayoutFieldData('title'), 'text'),
                LayoutPartData::field('abstract', 'One line about it', new LayoutFieldData('abstract'), 'text'),
                LayoutPartData::field('body', 'Text', new LayoutFieldData('body'), 'area'),
            ],
            [
                LayoutPartData::action(
                    'send',
                    $kind === 'doc' ? 'File document' : 'File report',
                    LayoutActionData::submitting(),
                    'primary',
                ),
            ],
        );
    }
}
