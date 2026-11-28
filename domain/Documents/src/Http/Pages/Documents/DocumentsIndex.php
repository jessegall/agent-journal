<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages\Documents;

use App\Http\Pages\CreationDialog;
use App\Navigation\Contracts\DraftProducers;
use App\Navigation\Contracts\RecordMenus;
use App\Settings\Enums\ActionMethod;
use App\Support\Layout\Contracts\ProjectField;
use App\Support\Layout\Contracts\ProjectRowLabel;
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
use App\Values\ProjectOwner;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\PublicationCard;
use Domain\Documents\Data\PublicationList;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\LibraryTypeFilter;
use Spatie\LaravelData\Optional;

/**
 * The library on the shared list recipe: who sees its records, the search, the type and attention choices, its records
 * by number, paging and a dialog to file a document or a report. An empty library says whether the search or a fresh
 * journal is why.
 */
final readonly class DocumentsIndex extends DocumentsPage
{
    public function __construct(
        private RecordMenus $menus,
        private DraftProducers $producers,
        private ProjectField $projectField,
        private ProjectRowLabel $projectLabel,
    ) {}

    public function of(
        DocumentFilters $filters,
        LibraryTypeFilter $type,
        PublicationList|null $documents,
        PublicationList|null $reports,
        LayoutPartData ...$reader,
    ): DeclaredLayoutData {
        $rows = [];

        if ($documents !== null) {
            $rows = $this->rowsOf($documents, 'doc', 'docs', true);
        }

        if ($reports !== null) {
            $rows = [
                ...$rows,
                ...$this->rowsOf($reports, 'report', 'reports', false),
            ];
        }

        return ListPage::make('Documents', $rows, $this->emptyFor($filters))
            ->searching(
                'Search documents',
                LayoutFieldData::build()
                    ->name('query')
                    ->value($filters->searchWords()->getOrElse(''))
                    ->clears(['after', 'page'])
                    ->finish(),
            )
            ->creatingWith($this->creation('doc', 'New document'), $this->creation('report', 'New report'))
            ->paged(ListPaging::build()
                ->after($type === LibraryTypeFilter::All ? null : $this->nextOf($documents ?? $reports))
                ->finish())
            ->withReader(LayoutBackData::build()->href('/documents')->label('Documents')->finish(), ...$reader)
            ->layout();
    }

    /**
     * @return list<LayoutRowData>
     */
    private function rowsOf(PublicationList $list, string $label, string $path, bool $hasMenu): array
    {
        return array_map(fn (PublicationCard $card) => LayoutRowData::build()
            ->key($card->id)
            ->label("{$label} {$card->number} · {$card->title}")
            ->value($card->attention->value)
            ->detail($card->summaryLine())
            ->href("/documents/{$path}/{$card->number}")
            ->trailing($this->projectLabel->partsFor(ProjectOwner::fromKey($card->ownerKey)))
            ->menu(
                $hasMenu
                ? $this->menus->onRecord(DocumentsDomain::DOCUMENT_ACTIONS, $card->number)
                : Optional::create(),
            )
            ->finish(), $list->rows);
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
                $filters->searchWords()->map(fn (string $words) => "Nothing matches \"{$words}\".")
                    ->getOrElse('Nothing matches this filter.'),
                'Clear search',
                ['query' => '', 'attention' => AttentionFilter::Active->value, 'after' => ''],
            );
        }

        return ListEmpty::build()
            ->title('No documents yet')
            ->detail('Designs, plans and notes that you and the agents write are kept here.')
            ->icon('docs')
            ->actions([$this->creation('doc', 'New document', 'first', 'primary')])
            ->fillsPage(true)
            ->finish();
    }

    /**
     * A dialog that files a document or a report from its Title, One line about it and Text, under All projects with
     * the project it goes to (Global too for a document), sent to the registered create action of its type.
     */
    private function creation(
        string $type,
        string $label,
        string $key = 'create',
        string $openerStyle = 'bordered',
    ): LayoutPartData {
        $route = $type === 'doc' ? 'documents.create-document' : 'documents.create-report';
        $guidedNoun = $this->guidedNounOf($type);

        $creation = CreationDialog::build()
            ->key("{$key}-{$type}")
            ->title($label)
            ->confirmation($type === 'doc' ? 'Document filed' : 'Report filed')
            ->sendLabel($type === 'doc' ? 'Create document' : 'Create report')
            ->guidedNoun($guidedNoun)
            ->waysInHeader($key === 'create')
            ->finish();

        return $this->creationDialog(
            $creation,
            LayoutPartData::build()
                ->asAction()
                ->key('open')
                ->label($label)
                ->action(LayoutActionData::build()->query([])->finish())
                ->style($openerStyle)
                ->finish(),
            LayoutFormData::build()->method(ActionMethod::Post)->href(route($route, [], false))->finish(),
            [
                LayoutPartData::build()
                    ->asField()
                    ->key('title')
                    ->label('Title')
                    ->field(LayoutFieldData::build()->name('title')->finish())
                    ->style('text')
                    ->finish(),
                LayoutPartData::build()
                    ->asField()
                    ->key('abstract')
                    ->label('One line about it')
                    ->field(LayoutFieldData::build()->name('abstract')->finish())
                    ->style('text')
                    ->finish(),
                LayoutPartData::build()
                    ->asField()
                    ->key('body')
                    ->label('Text')
                    ->field(LayoutFieldData::build()->name('body')->finish())
                    ->style('area')
                    ->finish(),
                ...($type === 'doc' ? $this->projectField->forProjectOrGlobal() : $this->projectField->forProject()),
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
