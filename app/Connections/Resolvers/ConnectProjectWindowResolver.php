<?php

declare(strict_types=1);

namespace App\Connections\Resolvers;

use App\Agents\Support\InstallLineAvailability;
use App\Agents\Support\PublishedReleases;
use App\Agents\Support\ServerOrigin;
use App\Connections\Models\Environment;
use App\Connections\Models\Project;
use App\Connections\Models\ProjectBinding;
use App\Connections\Support\InstallAttemptList;
use App\Http\Data\Connections\ConnectProjectWindowData;
use App\Http\Data\Connections\InstallAttemptListData;
use App\Http\Data\Connections\JoinTargetData;
use App\Http\Data\Connections\ProjectBindingRowData;
use App\Http\Data\Connections\ReleaseOfferData;
use App\Ui\Contracts\PageResolver;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

/**
 * The Connect a project window: this server's name and origin, whether it may issue install lines, the projects a
 * Join line can join with their environments, and every connected folder, each with where it stands at server time.
 */
final readonly class ConnectProjectWindowResolver implements PageResolver
{
    public function __construct(
        private InstallLineAvailability $availability,
        private ServerOrigin $origin,
        private PublishedReleases $releases,
        private InstallAttemptList $attempts,
        private Request $request,
    ) {}

    public function read(): ConnectProjectWindowData
    {
        $now = CarbonImmutable::now();
        $projects = Project::listed();
        $environments = Environment::listedOfProjects(array_map(fn (Project $project) => $project->id, $projects));

        return ConnectProjectWindowData::from([
            'serverName' => $this->origin->name(),
            'origin' => $this->origin->canonical(),
            'canIssue' => $this->availability->canIssue(),
            'release' => ReleaseOfferData::ofPublished($this->releases->currentRelease()),
            'attempts' => InstallAttemptListData::fromPage($this->attempts->page($this->attemptsCursor())),
            'projects' => array_map(
                fn (Project $project) => JoinTargetData::fromProject($project, $environments),
                $projects,
            ),
            'bindings' => array_map(
                fn (ProjectBinding $binding) => ProjectBindingRowData::fromBinding($binding, $now),
                ProjectBinding::listed(),
            ),
        ]);
    }

    /**
     * The cursor of the install attempts page the window asked for, none for the first.
     */
    private function attemptsCursor(): string|null
    {
        return $this->request->filled('attempts') ? $this->request->string('attempts')->toString() : null;
    }
}
