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
use App\Ui\Layout\LayoutFieldData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Optional;

/**
 * The owner's shares and proposals, newest first, as a list layout: the state choices and the record type, gateway
 * and expiry fields, each writing the window's query and starting the list again, the rows opening their own share,
 * an empty state that says whether a filter narrowed it, and the next page while there is one. No address is ever
 * part of the list.
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
        $parts = [
            LayoutPartData::box('header', 'header', LayoutPartData::text('title', 'Shares', 'heading')),
            $this->filtersOf($filters),
            $this->rowsOf($shown, $filters),
        ];

        if (count($found) > self::ROWS && $last !== null) {
            $older = LayoutActionData::changing(['after' => $last->id]);
            $parts[] = LayoutPartData::action('older', 'Older shares', $older);
        }

        return DeclaredLayoutData::of(LayoutPartData::box('shares', 'stack', ...$parts));
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
     */
    private function rowsOf(array $rows, ShareFiltersData $filters): LayoutPartData
    {
        if ($rows === []) {
            return LayoutPartData::notice(
                'empty',
                'empty',
                $this->isFiltered($filters) ? 'No share matches these filters.' : 'No shares yet.',
            );
        }

        return LayoutPartData::collection('rows', 'list', array_map(fn (ShareRowData $row) => new LayoutRowData(
            $row->id,
            ($row->isProposal ? 'Proposal' : 'Share')." {$row->number}",
            $row->state->value,
            detail: implode(' · ', array_filter([
                $row->rootType,
                $row->gatewayKey,
                'expires '.CarbonImmutable::parse($row->expiresAt)->toDateString(),
            ])),
            href: "/sharing/shares/{$row->id}",
        ), $rows));
    }

    private function isFiltered(ShareFiltersData $filters): bool
    {
        return ! $filters->state instanceof Optional
            || $filters->rootType !== null
            || $filters->gateway !== null
            || $filters->expiresBefore !== null;
    }
}
