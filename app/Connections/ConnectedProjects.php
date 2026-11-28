<?php

declare(strict_types=1);

namespace App\Connections;

use App\Actors\Contracts\ActorLabels;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Connections\Data\BindingListData;
use App\Connections\Data\ConnectProjectWindowData;
use App\Connections\Data\InstallAttemptListData;
use App\Connections\Data\JoinTargetData;
use App\Connections\Data\ProjectBindingRowData;
use App\Connections\Data\ReleaseOfferData;
use App\Connections\Data\SupportRecordRowData;
use App\Connections\Data\TerminalSignInRowData;
use App\Connections\Enums\BindingReadiness;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\DeviceGrant;
use App\Models\Projects\Environment;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Projects\Enums\InstallLineHold;
use App\Support\ActorLabelSet;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;

/**
 * The Connect a project window: this server's name and origin, whether it may issue install lines, the projects a
 * Join line can join with their environments, and every connected folder, each with where it stands at server time.
 */
final readonly class ConnectedProjects
{
    public function __construct(
        private InstallLineAvailability $availability,
        private ServerOrigin $origin,
        private PublishedReleases $releases,
        private InstallAttemptList $attempts,
        private ActorLabels $labels,
        private DriverCatalogue $drivers,
    ) {}

    public function read(ConnectionCursors $cursors): ConnectProjectWindowData
    {
        $now = CarbonImmutable::now();
        $projects = Project::findListed();
        $environments = Environment::findListedOfProjects(array_map(fn (Project $project) => $project->id, $projects));

        return ConnectProjectWindowData::build()
            ->serverName($this->origin->name())
            ->origin($this->origin->canonical())
            ->canIssue($this->availability->canIssue())
            ->holdReasons(
                array_map(fn (InstallLineHold $hold) => $hold->sentence(), $this->availability->holds()),
            )
            ->release(ReleaseOfferData::ofPublished($this->releases->currentRelease()))
            ->attempts(InstallAttemptListData::fromPage($this->attempts->page($cursors->attempts)))
            ->projects(
                array_map(
                    fn (Project $project) => JoinTargetData::fromProject($project, $environments),
                    $projects,
                ),
            )
            ->bindings($this->bindingList($now, $cursors->bindings))
            ->finish();
    }

    /**
     * One page of the connected folders at this server time, and when the page must be read again: the earliest
     * presence of a ready folder that expires.
     */
    private function bindingList(CarbonImmutable $now, string|null $cursor): BindingListData
    {
        $page = ProjectBinding::findPageAfter($cursor);
        $bindings = array_values($page->items());

        $expiries = array_values(array_filter(array_map(
            fn (ProjectBinding $binding) => $binding->readinessAt($now) === BindingReadiness::Ready
                ? $binding->presence_expires_at?->toIso8601String()
                : null,
            $bindings,
        )));

        sort($expiries);
        $nextCursor = $page->nextCursor();

        return BindingListData::from([
            'rows' => $this->bindingRows($bindings, $now),
            'serverTime' => $now->toIso8601String(),
            'refreshAt' => $expiries[0] ?? null,
            'nextCursor' => $nextCursor?->encode(),
        ]);
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
        $grants = DeviceGrant::findListedOfBindings(array_map(fn (ProjectBinding $binding) => $binding->id, $bindings));

        $approvers = array_values(array_filter(array_map(
            fn (DeviceGrant $grant) => $grant->approved_by_user_id,
            $grants,
        )));

        $labels = $this->labels->labelsFor(array_map(
            fn (string $userId) => ActorReference::forUser($userId),
            array_values(array_unique($approvers)),
        ));

        $audits = ConnectionAudit::findNewestOfBindings(
            array_map(fn (ProjectBinding $binding) => $binding->id, $bindings),
        );

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

        $name = $labels->nameOf(ActorReference::forUser($grant->approved_by_user_id));

        return $name ?? 'An account that is gone';
    }
}
