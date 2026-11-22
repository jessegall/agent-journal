<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Ui\Contracts\PageResolver;
use App\Ui\Contracts\RecordMenus;
use App\Ui\Enums\ActionMethod;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutBackData;
use App\Ui\Layout\LayoutDialogData;
use App\Ui\Layout\LayoutFieldData;
use App\Ui\Layout\LayoutFormData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use App\Ui\Layout\ListEmpty;
use App\Ui\Layout\ListPage;
use App\Ui\Layout\ListPaging;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Data\PublicationList;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\LibraryTypeFilter;
use Domain\Documents\Http\Requests\ListRecordsRequest;

/**
 * The library on the shared list recipe: who sees its records, the search over titles, abstracts and text, the type and
 * attention choices, then its records by number, each opening its own page, a way to the next page and a dialog to file
 * a document or a report. A library with nothing to show says whether the search or a fresh journal is why, and offers
 * to clear the search or to file the first document.
 */
final readonly class LibraryWindowResolver implements PageResolver
{
    public const string SHARING_NOTICE = 'Documents and reports are shared with every agent and user of this journal; linked private records stay private.';

    public function __construct(
        private DocumentResolver $documents,
        private ReportResolver $reports,
        private ListRecordsRequest $request,
        private RecordMenus $menus,
    ) {}

    public function read(): DeclaredLayoutData
    {
        $filters = $this->request->filters();
        $type = $this->request->typeFilter();
        $documents = $type->isForDocuments() ? $this->documents->list($filters) : null;
        $reports = $type->isForReports() ? $this->reports->list($filters) : null;

        $rows = [
            ...($documents === null ? [] : $this->rowsOf($documents, 'doc', 'docs', true)),
            ...($reports === null ? [] : $this->rowsOf($reports, 'report', 'reports', false)),
        ];

        return ListPage::make('Documents', $rows, $this->emptyFor($filters))
            ->searching(
                'Search titles, abstracts and text',
                new LayoutFieldData('query', $filters->query, ['after', 'page']),
            )
            ->filteredBy(
                LayoutPartData::text('sharing', self::SHARING_NOTICE, 'muted'),
                $this->choicesOf('type', LibraryTypeFilter::cases(), $type),
                $this->choicesOf('attention', AttentionFilter::cases(), $filters->attention),
            )
            ->creatingWith($this->creation('doc', 'Create document'), $this->creation('report', 'Create report'))
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
     * @param  list<LibraryTypeFilter|AttentionFilter>  $cases
     */
    private function choicesOf(string $key, array $cases, LibraryTypeFilter|AttentionFilter $chosen): LayoutPartData
    {
        return LayoutPartData::collection($key, 'choices', array_map(fn ($case) => LayoutRowData::from([
            'key' => $case->value,
            'label' => $case->label(),
            'query' => [$key => $case->value, 'after' => ''],
            'isCurrent' => $case === $chosen,
        ]), $cases));
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

        return ListEmpty::offering(
            'No documents or reports yet.',
            $this->creation('doc', 'Create document', 'create-first'),
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
            [LayoutPartData::action('send', $label, LayoutActionData::submitting(), 'primary')],
        );
    }
}
