<?php

declare(strict_types=1);

namespace App\Connections\Models;

use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Models\Agent;
use App\Agents\Models\Host;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Events\ProjectBindingCreated;
use App\Connections\Events\ProjectBindingReadinessChanged;
use App\Connections\Events\ProjectBindingRevoked;
use App\Connections\Exceptions\BindingUnrecoverable;
use App\Connections\Exceptions\PresenceRefused;
use App\Connections\Values\BindingFolder;
use App\Connections\Values\PresenceReceipt;
use App\Connections\Values\PresenceReport;
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One project folder on one machine, joined to a project through that machine's host, with the main agent that works
 * in it. The relay names the folder by an opaque root id; its canonical path never reaches a label or a log. Every
 * credential it holds belongs to one authority generation, which a revocation raises.
 *
 * @property string $id
 * @property string $host_id
 * @property string $project_id
 * @property string $main_agent_id
 * @property string $root_id
 * @property string $canonical_root
 * @property string $project_label
 * @property string $machine_label
 * @property string $installation_nonce
 * @property int $authority_generation
 * @property BindingReadiness $readiness
 * @property CarbonImmutable|null $last_contact_at
 * @property CarbonImmutable|null $presence_expires_at
 * @property string|null $boot_id
 * @property int $report_sequence
 * @property int $boot_generation
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Agent $mainAgent
 * @property-read Host $host
 * @property-read Project $project
 */
#[Fillable([
    'host_id', 'project_id', 'main_agent_id', 'root_id', 'canonical_root', 'project_label', 'machine_label',
    'installation_nonce',
])]
final class ProjectBinding extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * How long one presence report keeps a binding ready; the relay reports again well before it ends.
     */
    public const int PRESENCE_SECONDS = 120;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'authority_generation' => 'integer',
            'readiness' => BindingReadiness::class,
            'last_contact_at' => 'immutable_datetime',
            'presence_expires_at' => 'immutable_datetime',
            'report_sequence' => 'integer',
            'boot_generation' => 'integer',
        ];
    }

    /**
     * Joins the folder to the project through the host, pending until its relay first reports, in authority
     * generation 1.
     */
    public static function create(Host $host, Project $project, Agent $mainAgent, BindingFolder $folder): self
    {
        $binding = new self();
        $binding->host_id = $host->id;
        $binding->project_id = $project->id;
        $binding->main_agent_id = $mainAgent->id;
        $binding->root_id = $folder->rootId;
        $binding->canonical_root = $folder->canonicalRoot;
        $binding->project_label = $project->label;
        $binding->machine_label = $folder->machineLabel;
        $binding->installation_nonce = $folder->installationNonce;
        $binding->authority_generation = 1;
        $binding->readiness = BindingReadiness::Pending;
        $binding->report_sequence = 0;
        $binding->boot_generation = 0;
        $binding->assertSaved($binding->save());
        $binding->raise(new ProjectBindingCreated($binding->id, $project->id, $host->id, CarbonImmutable::now()));

        return $binding;
    }

    // ----------[ Queries ]----------

    /**
     * The binding this host's redemption made under its installation nonce.
     *
     * @throws BindingUnrecoverable
     */
    public static function ofHostByNonce(string $hostId, string $installationNonce): self
    {
        return self::query()->where('host_id', $hostId)->where('installation_nonce', $installationNonce)
            ->firstOr(fn () => throw BindingUnrecoverable::generic());
    }

    /**
     * Every connected folder, newest first; an installation connects a handful.
     *
     * @return list<self>
     */
    public static function listed(): array
    {
        return array_values(
            self::query()->latest()->readAll('an installation connects a handful of folders')->get()->all(),
        );
    }

    /**
     * The binding whose main agent this is, with its project, if the agent works in a connected folder: none or one.
     *
     * @return list<self>
     */
    public static function ofMainAgent(string $agentId): array
    {
        return array_values(self::query()->with('project')->where('main_agent_id', $agentId)
            ->where('readiness', '!=', BindingReadiness::Revoked)->limit(1)->get()->all());
    }

    /**
     * The binding of this id, locked until the transaction ends.
     */
    public static function lockById(string $id): self
    {
        return self::query()->with('host')->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Mutations ]----------

    /**
     * Records a presence report by server time. A sequence of the live boot no higher than the last changes nothing;
     * a new boot replaces a live one only when it takes over, and every new boot raises the boot generation. A
     * provisioned report on this journal's protocol makes the binding ready until its presence expires.
     *
     * @throws PresenceRefused
     */
    public function recordPresence(PresenceReport $report): PresenceReceipt
    {
        $now = CarbonImmutable::now();
        $isSameBoot = $this->boot_id === $report->bootId;

        if ($isSameBoot && $report->sequence <= $this->report_sequence) {
            return $this->receipt();
        }

        if (! $isSameBoot && $this->hasLivePresenceAt($now) && ! $report->takesOver) {
            throw PresenceRefused::anotherBootIsLive($this->id);
        }

        if (! $isSameBoot) {
            $this->boot_id = $report->bootId;
            $this->boot_generation++;
        }

        $readiness = $this->readinessOf($report);
        $changed = $readiness !== $this->readiness;
        $this->report_sequence = $report->sequence;
        $this->readiness = $readiness;
        $this->last_contact_at = $now;
        $this->presence_expires_at = $now->addSeconds(self::PRESENCE_SECONDS);
        $this->assertSaved($this->save());

        if ($changed) {
            $this->raise(new ProjectBindingReadinessChanged($this->id, $readiness, $now));
        }

        return $this->receipt();
    }

    /**
     * Ends the binding's authority: the generation rises, so every credential issued under the one before is refused.
     */
    public function revoke(): void
    {
        $this->authority_generation++;
        $this->readiness = BindingReadiness::Revoked;
        $this->assertSaved($this->save());
        $this->raise(new ProjectBindingRevoked($this->id, $this->authority_generation, CarbonImmutable::now()));
    }

    // ----------[ Answers ]----------

    /**
     * Whether this host may report the binding's presence: it is the binding's own host and the binding is not revoked.
     */
    public function isReportableBy(string $hostId): bool
    {
        return $this->host_id === $hostId && $this->readiness !== BindingReadiness::Revoked;
    }

    /**
     * Where the binding stands at this server time: a ready binding whose presence expired is offline.
     */
    public function readinessAt(CarbonImmutable $serverTime): BindingReadiness
    {
        if ($this->readiness !== BindingReadiness::Ready) {
            return $this->readiness;
        }

        if ($this->presence_expires_at === null || ! $serverTime->lessThan($this->presence_expires_at)) {
            return BindingReadiness::Offline;
        }

        return BindingReadiness::Ready;
    }

    // ----------[ Internals ]----------

    private function hasLivePresenceAt(CarbonImmutable $serverTime): bool
    {
        return $this->presence_expires_at !== null && $serverTime->lessThan($this->presence_expires_at);
    }

    /**
     * The readiness a report leaves: incompatible on another protocol, pending until the folder is set up, else ready.
     */
    private function readinessOf(PresenceReport $report): BindingReadiness
    {
        if ($report->protocol !== HostProtocolVersion::RemoteProject->value) {
            return BindingReadiness::Incompatible;
        }

        if (! $report->isProvisioned) {
            return BindingReadiness::Pending;
        }

        return BindingReadiness::Ready;
    }

    private function receipt(): PresenceReceipt
    {
        return new PresenceReceipt($this->boot_generation, (string) $this->presence_expires_at?->toIso8601String());
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return BelongsTo<Host, $this>
     */
    public function host(): BelongsTo
    {
        return $this->belongsTo(Host::class);
    }

    /**
     * @return BelongsTo<Agent, $this>
     */
    public function mainAgent(): BelongsTo
    {
        return $this->belongsTo(Agent::class, 'main_agent_id');
    }
}
