<?php

declare(strict_types=1);

namespace App\Sharing\Resolvers;

use App\Http\Data\Sharing\ShareFiltersData;
use App\Http\Data\Sharing\ShareRowData;
use App\Http\Requests\Sharing\ShareListRequest;
use App\Sharing\Enums\ShareState;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutBackData;
use App\Ui\Layout\LayoutFieldData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use App\Ui\Layout\ListEmpty;
use App\Ui\Layout\ListPage;
use App\Ui\Layout\ListPaging;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Optional;

/**
 * The owner's shares and proposals, newest first, on the shared list page: the state choices and the record type,
 * gateway and expiry fields, each writing the window's query and starting the list again, the rows opening their own
 * share, an empty state that says whether a filter narrowed it and offers to clear it, and Show more while there are
 * older ones. No address is ever part of the list.
 */
final readonly class ShareListResolver implements PageResolver
{
    private const int ROWS = 25;

    public function __construct(private ShareListRequest $request) {}

    public function read(): DeclaredLayoutData
    {
        $filters = $this->request->filters();
        $found = Share::listPage($filters->toFilters(), self::ROWS);
        $rows = array_slice($found, 0, self::ROWS);

        $gatewayKeys = ShareGatewayConfiguration::gatewayKeysOf(
            array_values(
                array_unique(
                    array_filter(array_map(fn (Share $share) => $share->share_gateway_configuration_id, $rows)),
                ),
            ),
        );

        $last = $rows === [] ? null : $rows[array_key_last($rows)];
        $shown = array_map(fn (Share $share) => ShareRowData::fromShare($share, $gatewayKeys), $rows);
        $after = $last instanceof Share && count($found) > self::ROWS ? $last->id : null;

        $page = ListPage::make('Shares', $this->rowsOf($shown), $this->emptyFor($filters))
            ->filteredBy($this->filtersOf($filters))
            ->paged(ListPaging::cursor($after))
            ->withReader(new LayoutBackData('/sharing', 'Shares'));

        if ($filters->after === null && $after === null) {
            $page->counting(count($shown));
        }

        return $page->layout();
    }

    private function filtersOf(ShareFiltersData $filters): LayoutPartData
    {
        $chosen = $filters->state instanceof ShareState ? $filters->state->value : '';

        $states = [
            new LayoutRowData('any', 'Any', query: ['state' => '', 'after' => ''], isCurrent: $chosen === ''),
            ...array_map(fn (ShareState $state) => new LayoutRowData(
                $state->value,
                $state->value,
                query: ['state' => $state->value, 'after' => ''],
                isCurrent: $chosen === $state->value,
            ), ShareState::cases()),
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
        return array_map(fn (ShareRowData $row) => new LayoutRowData(
            $row->id,
            ($row->isProposal ? 'Proposal' : 'Share')." {$row->number}",
            $row->state->value,
            detail: implode(' · ', array_filter([
                $row->rootType,
                $row->gatewayKey,
                'expires '.CarbonImmutable::parse($row->expiresAt)->toDateString(),
            ])),
            href: "/sharing/shares/{$row->id}",
        ), $rows);
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
