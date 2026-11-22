<?php

declare(strict_types=1);

namespace App\Connections\Resolvers;

use App\Actors\Contracts\ActorLabels;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\ActorLabelSet;
use App\Agents\Support\InstallLineAvailability;
use App\Agents\Support\PublishedReleases;
use App\Agents\Support\ServerOrigin;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\DeviceGrant;
use App\Connections\Models\Environment;
use App\Connections\Models\Project;
use App\Connections\Models\ProjectBinding;
use App\Connections\Support\InstallAttemptList;
use App\Drivers\Contracts\DriverCatalogue;
use App\Http\Data\Connections\BindingListData;
use App\Http\Data\Connections\ConnectProjectWindowData;
use App\Http\Data\Connections\InstallAttemptListData;
use App\Http\Data\Connections\JoinTargetData;
use App\Http\Data\Connections\ProjectBindingRowData;
use App\Http\Data\Connections\ReleaseOfferData;
use App\Http\Data\Connections\SupportRecordRowData;
use App\Http\Data\Connections\TerminalSignInRowData;
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
        private ActorLabels $labels,
        private Request $request,
        private DriverCatalogue $drivers,
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
            'bindings' => $this->bindingList($now),
        ]);
    }

    /**
     * One page of the connected folders at this server time, and when the page must be read again: the earliest
     * presence of a ready folder that expires.
     */
    private function bindingList(CarbonImmutable $now): BindingListData
    {
        $page = ProjectBinding::pageAfter($this->bindingsCursor());
        $bindings = array_values($page->items());

        $expiries = array_values(array_filter(array_map(
            fn (ProjectBinding $binding) => $binding->readinessAt($now) === BindingReadiness::Ready
                ? $binding->presence_expires_at?->toIso8601String()
                : null,
            $bindings,
        )));

        sort($expiries);

        return BindingListData::from([
            'rows' => $this->bindingRows($bindings, $now),
            'serverTime' => $now->toIso8601String(),
            'refreshAt' => $expiries[0] ?? null,
            'nextCursor' => $page->nextCursor()?->encode(),
        ]);
    }

    /**
     * The cursor of the connected folders page the window asked for, none for the first.
     */
    private function bindingsCursor(): string|null
    {
        return $this->request->filled('bindings') ? $this->request->string('bindings')->toString() : null;
    }

    /**
     * Every connected folder with its terminal sign-ins, read for all of them at once, and each approving account by
     * its name.
     *
     * @param  list<ProjectBinding>  $bindings
     * @return list<ProjectBindingRowData>
     */
    private function bindingRows(array $bindings, CarbonImmutable $now): array
    {
        $grants = DeviceGrant::listedOfBindings(array_map(fn (ProjectBinding $binding) => $binding->id, $bindings));

        $approvers = array_values(array_filter(array_map(
            fn (DeviceGrant $grant) => $grant->approved_by_user_id,
            $grants,
        )));

        $labels = $this->labels->labelsFor(array_map(
            fn (string $userId) => ActorIdentity::of(ActorContext::forUser($userId)),
            array_values(array_unique($approvers)),
        ));

        $release = $this->releases->currentRelease()[0]->version ?? 'the current one';
        $audits = ConnectionAudit::newestOfBindings(array_map(fn (ProjectBinding $binding) => $binding->id, $bindings));

        return array_map(fn (ProjectBinding $binding) => ProjectBindingRowData::fromBinding(
            $binding,
            $now,
            $this->drivers->families(),
            array_map(
                fn (DeviceGrant $grant) => TerminalSignInRowData::fromGrant(
                    $grant,
                    $this->approverOf($grant, $labels),
                    $now,
                ),
                array_values(array_filter($grants, fn (DeviceGrant $grant) => $grant->binding_id === $binding->id)),
            ),
            $release,
            array_map(
                SupportRecordRowData::fromAudit(...),
                array_slice(array_values(array_filter(
                    $audits,
                    fn (ConnectionAudit $audit) => $audit->binding_id === $binding->id,
                )), 0, ConnectionAudit::SUPPORT_RECORD_LIMIT),
            ),
        ), $bindings);
    }

    /**
     * The name of the account that approved the grant, as the owner reads it.
     */
    private function approverOf(DeviceGrant $grant, ActorLabelSet $labels): string
    {
        if ($grant->approved_by_user_id === null) {
            return 'Not approved yet';
        }

        $name = $labels->nameOf(ActorIdentity::of(ActorContext::forUser($grant->approved_by_user_id)));

        return $name ?? 'An account that is gone';
    }

    /**
     * The cursor of the install attempts page the window asked for, none for the first.
     */
    private function attemptsCursor(): string|null
    {
        return $this->request->filled('attempts') ? $this->request->string('attempts')->toString() : null;
    }
}
