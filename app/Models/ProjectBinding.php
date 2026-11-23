<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ArrangementType;
use App\Enums\BindingReadiness;
use App\Events\ProjectBindingCreated;
use App\Events\ProjectBindingEnvironmentAssigned;
use App\Events\ProjectBindingReadinessChanged;
use App\Events\ProjectBindingRevoked;
use App\Exceptions\BindingStartRefused;
use App\Exceptions\BindingUnrecoverable;
use App\Exceptions\PresenceRefused;
use App\Values\BindingFolder;
use App\Values\DriverFamily;
use App\Values\PresenceReceipt;
use App\Values\PresenceReport;
use App\Values\ProviderEligibility;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * One project folder on one machine, joined to a project through that machine's host, with the main agent that works
 * in it. The relay names the folder by an opaque root id; its canonical path never reaches a label or a log. Every
 * credential it holds belongs to one authority generation, which a revocation raises.
 *
 * @property string $id
 * @property string $host_id
 * @property string $project_id
 * @property string|null $environment_id
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
 * @property int $setup_generation
 * @property string|null $reconciled_boot_id
 * @property string|null $leased_runtime_id
 * @property CarbonImmutable|null $lease_expires_at
 * @property CarbonImmutable|null $revoked_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Agent $mainAgent
 * @property-read Host $host
 * @property-read Project $project
 * @property-read Environment|null $environment
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

    /**
     * The most connected folders one page of the list holds.
     */
    public const int PAGE_LIMIT = 25;

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
            'setup_generation' => 'integer',
            'lease_expires_at' => 'immutable_datetime',
            'revoked_at' => 'immutable_datetime',
        ];
    }

    /**
     * Joins the folder to the project's environment through the host, pending until its relay first reports, in
     * authority generation 1.
     */
    public static function create(
        Host $host,
        Project $project,
        Environment $environment,
        Agent $mainAgent,
        BindingFolder $folder,
    ): self {
        $binding = new self();
        $binding->host_id = $host->id;
        $binding->project_id = $project->id;
        $binding->environment_id = $environment->id;
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
        $binding->setup_generation = 0;
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
     * The binding of this host, whatever its readiness; another host's binding is refused.
     *
     * @throws PresenceRefused
     */
    public static function ofHost(string $hostId, string $id): self
    {
        return self::query()->whereKey($id)->where('host_id', $hostId)
            ->firstOr(fn () => throw PresenceRefused::notReadableBy($id));
    }

    /**
     * One page of the connected folders, PAGE_LIMIT at a time, oldest first by creation time and then id, with the
     * project, environment and host each names; the cursor reads the next slice in the same order.
     *
     * @return CursorPaginator<int, self>
     */
    public static function pageAfter(string|null $cursor): CursorPaginator
    {
        return self::query()->with(['project', 'environment', 'host'])->orderBy('created_at')->orderBy('id')
            ->cursorPaginate(self::PAGE_LIMIT, cursor: $cursor);
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
     * The connected folder heard from last, among these environments' or, with none named, among every project's:
     * the one a Project window shows.
     *
     * @param  list<string>  $environmentIds
     * @return Option<self>
     */
    public static function lastHeardFromIn(array $environmentIds): Option
    {
        return self::query()
            ->where('readiness', '!=', BindingReadiness::Revoked)
            ->when($environmentIds !== [], fn ($query) => $query->whereIn('environment_id', $environmentIds))
            ->orderByRaw('last_contact_at desc nulls last')
            ->firstOption();
    }

    /**
     * The binding's authority generation, which every lease renewal of its runtimes must carry.
     */
    public static function authorityGenerationOf(string $bindingId): int
    {
        return self::query()->whereKey($bindingId)->firstOrFail()->authority_generation;
    }

    /**
     * Whether this agent is the main agent of a revoked binding, whose every call is refused.
     */
    public static function isMainAgentOfRevokedBinding(string $agentId): bool
    {
        return self::query()->where('main_agent_id', $agentId)->where('readiness', BindingReadiness::Revoked)->exists();
    }

    /**
     * The id of the live binding a local host serves, none or one: each binding has a host of its own.
     *
     * @return list<string>
     */
    public static function liveIdOfLocalHost(string $hostId): array
    {
        return array_values(self::query()->where('host_id', $hostId)
            ->where('readiness', '!=', BindingReadiness::Revoked)
            ->whereHas('host', fn ($host) => $host->where('arrangement', ArrangementType::Local))
            ->limit(1)->pluck('id')->all());
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
            return $this->presenceReceipt();
        }

        // A relay of a setup older than the one acknowledged changes nothing, as a stale sequence does.
        if ($report->setupGeneration < $this->setup_generation) {
            return $this->presenceReceipt();
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

        if ($report->isReconciled) {
            $this->reconciled_boot_id = $report->bootId;
        }

        $this->report_sequence = $report->sequence;
        $this->setup_generation = $report->setupGeneration;
        $this->readiness = $readiness;
        $this->last_contact_at = $now;
        $this->presence_expires_at = $now->addSeconds(self::PRESENCE_SECONDS);
        $this->assertSaved($this->save());

        if ($changed) {
            $this->raise(new ProjectBindingReadinessChanged($this->id, $readiness, $now));
        }

        return $this->presenceReceipt();
    }

    /**
     * Keeps which runtime holds the binding's lease and when it ends, so a lease that ends with no stop confirmed is
     * shown.
     */
    public function holdLease(string $runtimeId, CarbonImmutable $expiresAt): void
    {
        $this->leased_runtime_id = $runtimeId;
        $this->lease_expires_at = $expiresAt;
        $this->assertSaved($this->save());
    }

    /**
     * Takes the device's receipt that the runtime's session stopped; a receipt for another runtime, or one taken
     * already, changes nothing.
     */
    public function confirmStop(string $runtimeId): void
    {
        if ($this->leased_runtime_id !== $runtimeId) {
            return;
        }

        $this->leased_runtime_id = null;
        $this->lease_expires_at = null;
        $this->assertSaved($this->save());
    }

    /**
     * Ends the binding's authority: the generation rises, so every credential issued under the one before is refused.
     */
    public function revoke(): void
    {
        if ($this->isRevoked()) {
            return;
        }

        $now = CarbonImmutable::now();
        $this->authority_generation++;
        $this->readiness = BindingReadiness::Revoked;
        $this->revoked_at = $now;
        $this->assertSaved($this->save());
        $this->raise(new ProjectBindingRevoked($this->id, $this->authority_generation, $now));
    }

    /**
     * Puts a binding with no environment into an environment of its own project, the owner's explicit choice.
     *
     * @throws BindingStartRefused
     */
    public function assignEnvironment(Environment $environment): void
    {
        if ($environment->project_id !== $this->project_id) {
            throw BindingStartRefused::otherProjectsEnvironment($this->id);
        }

        $this->environment_id = $environment->id;
        $this->assertSaved($this->save());
        $this->raise(new ProjectBindingEnvironmentAssigned($this->id, $environment->id, CarbonImmutable::now()));
    }

    // ----------[ Answers ]----------

    public function isRevoked(): bool
    {
        return $this->readiness === BindingReadiness::Revoked;
    }

    /**
     * When the server took the binding's revocation, in ISO 8601; empty for a binding not revoked.
     */
    public function revokedAtText(): string
    {
        return (string) $this->revoked_at?->toIso8601String();
    }

    /**
     * Whether the relay of the binding's current boot reported what became of its earlier sessions, so starts and
     * commands may run again.
     */
    public function isReconciled(): bool
    {
        return $this->reconciled_boot_id !== null && $this->reconciled_boot_id === $this->boot_id;
    }

    /**
     * Whether a session's lease ended at this server time and its device has not confirmed the session stopped.
     */
    public function isStopUnconfirmedAt(CarbonImmutable $serverTime): bool
    {
        return $this->leased_runtime_id !== null
            && $this->lease_expires_at !== null
            && ! $serverTime->lessThan($this->lease_expires_at);
    }

    /**
     * Whether the binding works in no environment yet: it starts nothing and runs no command until the owner assigns
     * one.
     */
    public function isEnvironmentUnassigned(): bool
    {
        return $this->environment_id === null;
    }

    /**
     * Whether a start names the binding's registered root: its root id and folder, in a folder its host permits.
     */
    public function isRootOf(string $rootId, string $folder): bool
    {
        return $rootId === $this->root_id
            && $folder === $this->canonical_root
            && $this->host->permitsFolder($folder);
    }

    /**
     * Whether this host may report the binding's presence: it is the binding's own host and the binding is not revoked.
     */
    public function isReportableBy(string $hostId): bool
    {
        return $this->host_id === $hostId && ! $this->isRevoked();
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

    /**
     * Whether the binding may start the driver: one whose hooks run isolated per session, that its relay reported it
     * can run with isolated hooks, start grants and a lease.
     */
    public function eligibilityOf(DriverFamily $family): ProviderEligibility
    {
        if (! $family->isolatesHooksPerSession) {
            return ProviderEligibility::unavailable(
                $family,
                "{$family->label} does not keep its hooks to one session yet, so a connected folder cannot run it isolated.",
            );
        }

        if (! $this->host->declaresDriver($family->key)) {
            return ProviderEligibility::unavailable(
                $family,
                "This folder's relay has not reported it can run {$family->label} with isolated hooks and a lease.",
            );
        }

        return ProviderEligibility::eligible($family);
    }

    /**
     * What the journal holds of the binding's presence now, with its effective readiness and last confirmed contact.
     */
    public function presenceReceipt(): PresenceReceipt
    {
        $now = CarbonImmutable::now();

        return new PresenceReceipt(
            $this->id,
            $this->boot_generation,
            $this->setup_generation,
            $now->toIso8601String(),
            (string) $this->presence_expires_at?->toIso8601String(),
            $this->authority_generation,
            $this->readinessAt($now)->value,
            $this->last_contact_at?->toIso8601String(),
        );
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
     * @return BelongsTo<Environment, $this>
     */
    public function environment(): BelongsTo
    {
        return $this->belongsTo(Environment::class);
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

    // ----------[ Internals ]----------

    private function hasLivePresenceAt(CarbonImmutable $serverTime): bool
    {
        return $this->presence_expires_at !== null && $serverTime->lessThan($this->presence_expires_at);
    }

    /**
     * The readiness a report leaves: pending until the folder is set up, else ready.
     */
    private function readinessOf(PresenceReport $report): BindingReadiness
    {
        if (! $report->isProvisioned) {
            return BindingReadiness::Pending;
        }

        return BindingReadiness::Ready;
    }
}
