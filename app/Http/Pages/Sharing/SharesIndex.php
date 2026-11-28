<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Sharing\Data\ShareFiltersData;
use App\Sharing\Data\ShareRowData;
use App\Sharing\Enums\ShareStatus;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\EmptyListState;
use App\Support\Layout\ListPage;
use App\Support\Layout\ListPaging;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Optional;

/**
 * The Shares page on the shared list recipe: the state choices and the record type, gateway and expiry fields, each
 * writing the window's query and starting the list again, the rows opening their own share, an empty state that says
 * whether a filter narrowed it and offers to clear it, and Show more while there are older ones.
 */
final readonly class SharesIndex extends SharingPage
{
    /**
     * @param  list<ShareRowData>  $shown
     */
    public function of(ShareFiltersData $filters, array $shown, string|null $after): DeclaredLayoutData
    {
        $page = ListPage::build()
            ->title('Shares')
            ->rows($this->rowsOf($shown), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty($this->emptyFor($filters))
            ->filteredBy($this->filtersOf($filters))
            ->paged(ListPaging::build()->after($after)->isAppend($filters->after !== null)->finish())
            ->withReader(LayoutBackData::build()->href('/sharing')->label('Shares')->finish());

        if ($filters->after === null && $after === null) {
            $page = $page->countingRows();
        }

        return $page->finish();
    }

    private function filtersOf(ShareFiltersData $filters): LayoutPartData
    {
        $chosen = $filters->status instanceof ShareStatus ? $filters->status->value : '';

        $states = [
            LayoutRowData::build()
                ->key('any')
                ->label('Any')
                ->query(['state' => '', 'after' => ''])
                ->isCurrent($chosen === '')
                ->finish(),
            ...array_map(
                fn (ShareStatus $status) => LayoutRowData::build()
                    ->key($status->value)
                    ->label($status->value)
                    ->query(['state' => $status->value, 'after' => ''])
                    ->isCurrent($chosen === $status->value)
                    ->finish(),
                ShareStatus::cases(),
            ),
        ];

        return LayoutPartData::build()
            ->asBox()
            ->key('filters')
            ->style('row')
            ->children(
                LayoutPartData::build()->asCollection()->key('state')->style('choices')->rows($states)->finish(),
                LayoutPartData::build()
                ->asField()
                ->key('root-type')
                ->label('Record type')
                ->field(
                    LayoutFieldData::build()
                    ->name('rootType')
                    ->value((string) $filters->rootType)
                    ->clears(['after'])
                    ->finish(),
                )
                ->style('text')
                ->finish(),
                LayoutPartData::build()
                ->asField()
                ->key('gateway')
                ->label('Gateway')
                ->field(
                    LayoutFieldData::build()
                    ->name('gateway')
                    ->value((string) $filters->gateway)
                    ->clears(['after'])
                    ->finish(),
                )
                ->style('text')
                ->finish(),
                LayoutPartData::build()
                ->asField()
                ->key('expires-before')
                ->label('Expires before')
                ->field(
                    LayoutFieldData::build()
                    ->name('expiresBefore')
                    ->value((string) $filters->expiresBefore)
                    ->clears(['after'])
                    ->finish(),
                )
                ->style('text')
                ->finish(),
            )
            ->finish();
    }

    /**
     * @param  list<ShareRowData>  $rows
     * @return list<LayoutRowData>
     */
    private function rowsOf(array $rows): array
    {
        return array_map(fn (
            ShareRowData $row,
        ) => LayoutRowData::build()
            ->key($row->id)
            ->label(($row->isProposal ? 'Proposal' : 'Share')." {$row->number}")
            ->value($row->status->value)
            ->detail(
                implode(' · ', array_filter([
                    $row->rootType,
                    $row->gatewayKey,
                    'expires '.CarbonImmutable::parse($row->expiresAt)->toDateString(),
                ])),
            )
            ->href("/sharing/shares/{$row->id}")
            ->finish(), $rows);
    }

    /**
     * A filter that emptied the list offers to clear every filter; shares are made from a record's own page, so an
     * unfiltered empty list only says so.
     */
    private function emptyFor(ShareFiltersData $filters): EmptyListState
    {
        if (! $this->isFiltered($filters)) {
            return EmptyListState::build()->title('No shares yet.')->finish();
        }

        return $this->nothingMatches(
            'No share matches these filters.',
            'Show all shares',
            ['state' => '', 'rootType' => '', 'gateway' => '', 'expiresBefore' => '', 'after' => ''],
        );
    }

    private function isFiltered(ShareFiltersData $filters): bool
    {
        return ! $filters->status instanceof Optional
            || $filters->rootType !== null
            || $filters->gateway !== null
            || $filters->expiresBefore !== null;
    }
}
