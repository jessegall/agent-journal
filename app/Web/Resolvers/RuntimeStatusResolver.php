<?php

declare(strict_types=1);

namespace App\Web\Resolvers;

use App\Agents\Contracts\RuntimeResolver;
use App\Agents\Data\RuntimeStatus;
use App\Ui\Contracts\PageResolver;
use App\Web\Data\RuntimeEntryData;
use App\Web\Data\RuntimesData;

/**
 * The runtime status page's data, read only through the runtime resolver: the first page of runtimes, each with its
 * latest requests. It writes nothing and needs no domain such as Chat.
 */
final readonly class RuntimeStatusResolver implements PageResolver
{
    private const int RUNTIMES = 50;

    private const int REQUESTS_EACH = 20;

    public function __construct(private RuntimeResolver $runtimes) {}

    public function read(): RuntimesData
    {
        $entries = array_map(fn (RuntimeStatus $status) => RuntimeEntryData::from([
            'status' => $status,
            'requests' => $this->runtimes->requestsOf($status->sessionId, self::REQUESTS_EACH),
        ]), $this->runtimes->page(1, self::RUNTIMES));

        return RuntimesData::from(['runtimes' => $entries]);
    }
}
