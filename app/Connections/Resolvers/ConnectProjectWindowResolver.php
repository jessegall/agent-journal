<?php

declare(strict_types=1);

namespace App\Connections\Resolvers;

use App\Agents\Support\InstallLineAvailability;
use App\Agents\Support\PublishedReleases;
use App\Agents\Support\ServerOrigin;
use App\Connections\Models\ProjectBinding;
use App\Http\Data\Connections\ConnectProjectWindowData;
use App\Http\Data\Connections\ProjectBindingRowData;
use App\Http\Data\Connections\ReleaseOfferData;
use App\Ui\Contracts\PageResolver;
use Carbon\CarbonImmutable;

/**
 * The Connect a project window: this server's name, whether it may issue install lines and every connected folder,
 * each with where it stands at server time.
 */
final readonly class ConnectProjectWindowResolver implements PageResolver
{
    public function __construct(
        private InstallLineAvailability $availability,
        private ServerOrigin $origin,
        private PublishedReleases $releases,
    ) {}

    public function read(): ConnectProjectWindowData
    {
        $now = CarbonImmutable::now();

        return ConnectProjectWindowData::from([
            'serverName' => $this->origin->name(),
            'canIssue' => $this->availability->canIssue(),
            'release' => ReleaseOfferData::fromPublished($this->releases->publishedManifest()),
            'bindings' => array_map(
                fn (ProjectBinding $binding) => ProjectBindingRowData::fromBinding($binding, $now),
                ProjectBinding::listed(),
            ),
        ]);
    }
}
