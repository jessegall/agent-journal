<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Pages\Resolvers;

use App\Contracts\Navigation\PageResolver;
use Domain\Sharing\Data\ShareRowData;
use Domain\Sharing\Http\Pages\SharesIndex;
use Domain\Sharing\Http\Requests\ShareListRequest;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use App\Support\Layout\DeclaredLayoutData;

/**
 * The owner's shares and proposals, newest first, a page of them at a time, with their gateways, for the Shares page.
 * No address is ever read for the list.
 */
final readonly class ShareListResolver implements PageResolver
{
    private const int ROWS = 25;

    public function __construct(private ShareListRequest $request, private SharesIndex $page) {}

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

        return $this->page->of($filters, $shown, $after);
    }
}
