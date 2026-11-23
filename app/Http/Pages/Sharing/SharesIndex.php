<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Data\Sharing\ShareFiltersData;
use App\Data\Sharing\ShareRowData;
use App\Enums\ShareState;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPage;
use App\Support\Layout\ListPaging;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Optional;

/**
 * The Shares page on the shared list recipe: the state choices and the record type, gateway and expiry fields, each
 * writing the window's query and starting the list again, the rows opening their own share, an empty state that says
 * whether a filter narrowed it and offers to clear it, and Show more while there are older ones.
 */
final readonly class SharesIndex
{
    /**
     * @param  list<ShareRowData>  $shown
     */
    public function of(ShareFiltersData $filters, array $shown, string|null $after): DeclaredLayoutData
    {
        $page = ListPage::make('Shares', $this->rowsOf($shown), $this->emptyFor($filters))
            ->filteredBy($this->filtersOf($filters))
            ->paged(ListPaging::cursor($after))
            ->withReader(new LayoutBackData('/sharing', 'Shares'));

        if ($filters->after === null && $after === null) {
            $page = $page->counting(count($shown));
        }

        return $page->layout();
    }

    private function filtersOf(ShareFiltersData $filters): LayoutPartData
    {
        $chosen = $filters->state instanceof ShareState ? $filters->state->value : '';

        $states = [
            LayoutRowData::from(
                ['key' => 'any', 'label' => 'Any', 'query' => ['state' => '', 'after' => ''], 'isCurrent' => $chosen === ''],
            ),
            ...array_map(
                fn (ShareState $state) => LayoutRowData::from(['key' => $state->value, 'label' => $state->value, 'query' => ['state' => $state->value, 'after' => ''], 'isCurrent' => $chosen === $state->value]),
                ShareState::cases(),
            ),
        ];

        return LayoutPartData::box(
            'filters',
            'row',
            LayoutPartData::collection('state', 'choices', $states),
            LayoutPartData::field(
                'root-type',
                'Record type',
                new LayoutFieldData('rootType', (string) $filters->rootType, ['after']),
                'text',
            ),
            LayoutPartData::field(
                'gateway',
                'Gateway',
                new LayoutFieldData('gateway', (string) $filters->gateway, ['after']),
                'text',
            ),
            LayoutPartData::field(
                'expires-before',
                'Expires before',
                new LayoutFieldData('expiresBefore', (string) $filters->expiresBefore, ['after']),
                'text',
            ),
        );
    }

    /**
     * @param  list<ShareRowData>  $rows
     * @return list<LayoutRowData>
     */
    private function rowsOf(array $rows): array
    {
        return array_map(fn (
            ShareRowData $row,
        ) => LayoutRowData::from(['key' => $row->id, 'label' => ($row->isProposal ? 'Proposal' : 'Share')." {$row->number}", 'value' => $row->state->value, 'detail' => implode(' · ', array_filter([
            $row->rootType,
            $row->gatewayKey,
            'expires '.CarbonImmutable::parse($row->expiresAt)->toDateString(),
        ])), 'href' => "/sharing/shares/{$row->id}"]), $rows);
    }

    /**
     * A filter that emptied the list offers to clear every filter; shares are made from a record's own page, so an
     * unfiltered empty list only says so.
     */
    private function emptyFor(ShareFiltersData $filters): ListEmpty
    {
        if (! $this->isFiltered($filters)) {
            return ListEmpty::informing('No shares yet.');
        }

        $clear = LayoutActionData::changing([
            'state' => '',
            'rootType' => '',
            'gateway' => '',
            'expiresBefore' => '',
            'after' => '',
        ]);

        return ListEmpty::offering(
            'No share matches these filters.',
            LayoutPartData::action('clear', 'Show all shares', $clear),
        );
    }

    private function isFiltered(ShareFiltersData $filters): bool
    {
        return ! $filters->state instanceof Optional
            || $filters->rootType !== null
            || $filters->gateway !== null
            || $filters->expiresBefore !== null;
    }
}
