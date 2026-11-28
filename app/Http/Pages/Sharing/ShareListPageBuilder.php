<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Http\Requests\Sharing\ShareListRequest;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Reads\PageFormRequests;
use App\Sharing\Data\ShareRowData;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * The owner's shares and proposals, newest first, a page of them at a time, with their gateways, for the Shares page.
 * No address is ever read for the list.
 */
final readonly class ShareListPageBuilder implements PageBuilder
{
    private const int ROWS = 25;

    public function __construct(private PageFormRequests $requests, private SharesIndex $page) {}

    public function build(Request $visit): ShareListPageData
    {
        return ShareListPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->forVisit(ShareListRequest::class, $visit);

        $filters = $input->filters();
        $found = Share::findListPage($filters->toFilters(), self::ROWS);
        $rows = array_slice($found, 0, self::ROWS);

        $gatewayKeys = ShareGatewayConfiguration::resolveGatewayKeysOf(
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
