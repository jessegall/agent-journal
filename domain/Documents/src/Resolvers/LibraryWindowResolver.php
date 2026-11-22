<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Ui\Contracts\PageResolver;
use App\Ui\Contracts\RecordMenus;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutFieldData;
use App\Ui\Layout\LayoutMenuData;
use App\Ui\Layout\LayoutNativeData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use Closure;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\CreateRecordPartData;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Data\PublicationList;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\LibraryTypeFilter;
use Domain\Documents\Http\Requests\ListRecordsRequest;

/**
 * The library as a declared layout: who sees its records, the search and the type and attention choices, then a
 * section per type with its newest records by number, each opening its own page, a way to the next page, and the
 * form that files a new one. A library with nothing to show says whether the search or a fresh journal is why.
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

        $parts = [
            LayoutPartData::text('sharing', self::SHARING_NOTICE, 'muted'),
            LayoutPartData::field(
                'search',
                'Search titles, abstracts and text',
                new LayoutFieldData('query', $filters->query, ['after', 'page']),
            ),
            LayoutPartData::box(
                'filters',
                'row',
                $this->choicesOf('type', LibraryTypeFilter::cases(), $type),
                $this->choicesOf('attention', AttentionFilter::cases(), $filters->attention),
            ),
        ];

        if ($this->isEmpty($documents) && $this->isEmpty($reports)) {
            $parts[] = $this->emptyOf($filters->query);
        }

        if ($documents !== null) {
            $menuOf = fn (PublicationCard $card) => [
                'menu' => $this->menus->onRecord(DocumentsDomain::DOCUMENT_ACTIONS, $card->number),
            ];
            $parts[] = $this->sectionOf(
                'documents',
                'Documents',
                'doc',
                'docs',
                $documents,
                $type,
                $filters,
                $menuOf,
            );
        }

        if ($reports !== null) {
            $noMenu = fn (PublicationCard $card) => [];
            $parts[] = $this->sectionOf(
                'reports',
                'Reports',
                'report',
                'reports',
                $reports,
                $type,
                $filters,
                $noMenu,
            );
        }

        return DeclaredLayoutData::of(LayoutPartData::box('library', 'stack', ...$parts));
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
     * The words of the active search and attention filter, none when the list shows every active record; the chosen
     * type is the tab, never a filter to clear.
     */
    private static function filterWords(DocumentFilters $filters): string|null
    {
        $words = [
            ...($filters->searches() ? ["\"{$filters->query}\""] : []),
            ...($filters->attention !== AttentionFilter::Active ? ["the {$filters->attention->label()} filter"] : []),
        ];

        return $words === [] ? null : implode(' and ', $words);
    }

    private function isEmpty(PublicationList|null $list): bool
    {
        return $list === null || $list->rows === [];
    }

    private function emptyOf(string $query): LayoutPartData
    {
        if ($query === '') {
            return LayoutPartData::notice(
                'empty',
                'empty',
                'No documents or reports yet.',
                'A document is lasting knowledge kept as revisions; a report says what was checked or found, once.',
            );
        }

        return LayoutPartData::box(
            'empty',
            'stack',
            LayoutPartData::notice('notice', 'empty', "Nothing matches \"{$query}\"."),
            LayoutPartData::action('clear', 'Clear search', LayoutActionData::changing(['query' => '', 'after' => ''])),
        );
    }

    /**
     * One type's records, each opening its own page and carrying the actions menu its type has; past the first page,
     * the next one, reached in the list of that type alone, since the two types do not share a cursor.
     *
     * @param  Closure(PublicationCard): array<string, LayoutMenuData>  $menuOf
     */
    private function sectionOf(
        string $key,
        string $heading,
        string $label,
        string $path,
        PublicationList $list,
        LibraryTypeFilter $type,
        DocumentFilters $filters,
        Closure $menuOf,
    ): LayoutPartData {
        $rows = array_map(fn (PublicationCard $card) => LayoutRowData::from([
            'key' => $card->id,
            'label' => "{$label} {$card->number} · {$card->title}",
            'value' => $card->attention->value,
            'detail' => $card->summaryLine(),
            'href' => "/documents/{$path}/{$card->number}",
            ...$menuOf($card),
        ]), $list->rows);

        $parts = [LayoutPartData::text('heading', $heading, 'heading')];

        if ($rows !== []) {
            $parts[] = LayoutPartData::collection('rows', 'list', $rows);
        }

        $filter = self::filterWords($filters);

        if ($rows === [] && $filter !== null) {
            $lower = strtolower($heading);
            $parts[] = LayoutPartData::notice('empty', 'empty', "No {$lower} match {$filter}.");

            $parts[] = LayoutPartData::action(
                'clear',
                'Clear filter',
                LayoutActionData::changing([
                    'query' => '',
                    'attention' => AttentionFilter::Active->value,
                    'after' => '',
                ]),
            );
        }

        if ($list->hasNextPage && $type === LibraryTypeFilter::All) {
            $more = LayoutActionData::changing(['type' => $label]);
            $parts[] = LayoutPartData::action('more', "More {$heading}", $more);
        }

        if ($list->next !== null && $type !== LibraryTypeFilter::All) {
            $next = LayoutActionData::changing(['after' => $list->next]);
            $parts[] = LayoutPartData::action('next', 'Next page', $next);
        }

        $form = CreateRecordPartData::from([
            'action' => "/documents/{$path}",
            'label' => $label === 'doc' ? 'File document' : 'File report',
        ]);

        $parts[] = LayoutPartData::native('create', LayoutNativeData::of('documents/CreateRecordForm', $form));

        return LayoutPartData::box($key, 'section', ...$parts);
    }
}
