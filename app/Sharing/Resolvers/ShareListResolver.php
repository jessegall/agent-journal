<?php

declare(strict_types=1);

namespace App\Sharing\Resolvers;

use App\Http\Data\Sharing\ShareListData;
use App\Http\Data\Sharing\ShareRowData;
use App\Http\Requests\Sharing\ShareListRequest;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Ui\Contracts\PageResolver;

/**
 * The owner's list of shares and proposals, newest first, a page at a time by the id the next page starts after;
 * proposals and failed shares are listed like every other, and no row carries an address.
 */
final readonly class ShareListResolver implements PageResolver
{
    private const int ROWS = 25;

    public function __construct(private ShareListRequest $request) {}

    public function read(): ShareListData
    {
        $filters = $this->request->filters();
        $found = Share::listPage($filters->toFilters(), self::ROWS);
        $rows = array_slice($found, 0, self::ROWS);
        $gatewayKeys = ShareGatewayConfiguration::gatewayKeysOf(
            array_values(array_unique(array_filter(array_map(fn (Share $share) => $share->share_gateway_configuration_id, $rows)))),
        );
        $last = $rows === [] ? null : $rows[array_key_last($rows)];

        return new ShareListData(
            array_map(fn (Share $share) => ShareRowData::fromShare($share, $gatewayKeys), $rows),
            $filters,
            count($found) > self::ROWS && $last !== null ? $last->id : null,
        );
    }
}
