<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Agents\Drivers\Enums\BoundaryItem;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Agents\Enums\ExecutionModeType;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Connections\HostCallAnswered;
use App\Events\Connections\HostCallFailed;
use App\Events\Connections\HostHeartbeatRecorded;
use App\Events\Connections\HostProtectionRecorded;
use App\Events\Connections\HostProtectionRunsRecorded;
use App\Events\Connections\HostRevoked;
use App\Exceptions\HostCredentialRejected;
use App\Exceptions\HostUnavailable;
use App\Exceptions\StartRefused;
use App\Hosts\Data\FailedHostCallData;
use App\Hosts\Enums\HostOrderType;
use App\Models\Hosts\HostOrder;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Profiles\Data\ProtectionReportData;
use App\Profiles\Data\ProtectionRunData;
use App\Projects\Enums\ArrangementType;
use App\Projects\Exceptions\HostArrangementRefused;
use App\Projects\Values\ProtectionEvidence;
use App\Projects\Values\StartPlace;
use App\Records\Contracts\ReadableModel;
use App\Terminals\Enums\TerminalInputType;
use App\Values\ProtectionReport;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $installation_name
 * @property string $credential_hash
 * @property list<string> $start_roots
 * @property DataCollection<int, ProtectionReportData> $protection
 * @property DataCollection<int, ProtectionRunData> $protection_runs
 * @property ArrangementType $arrangement
 * @property int $protocol
 * @property string|null $order_secret
 * @property list<string> $capabilities
 * @property list<string> $allowed_images
 * @property string|null $release
 * @property string|null $upgrade_release
 * @property string|null $upgrade_order_id
 * @property string|null $upgrade_failure
 * @property CarbonImmutable|null $revoked_at
 * @property CarbonImmutable|null $last_answered_at
 * @property CarbonImmutable|null $failing_since
 * @property CarbonImmutable|null $last_heartbeat_at
 * @property string|null $last_failure
 * @property DataCollection<int, FailedHostCallData>|null $reported_failures
 * @property string|null $failing_route
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read string $link_alarm
 *
 * @mixin \Eloquent
 */
final class Host extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * What the order secret is worked out for, on both sides.
     */
    public const string ORDER_SECRET_CONTEXT = 'journal host protocol 1 orders';

    /**
     * @return array<string, string>
     *
     * @column start_roots list<string>
     * @column capabilities list<string>
     * @column allowed_images list<string>
     */
    protected function casts(): array
    {
        return [
            'arrangement' => ArrangementType::class,
            'protocol' => 'integer',
            'order_secret' => 'encrypted',
            'capabilities' => 'array',
            'allowed_images' => 'array',
            'start_roots' => 'array',
            'protection' => DataCollection::class.':'.ProtectionReportData::class,
            'protection_runs' => DataCollection::class.':'.ProtectionRunData::class,
            'revoked_at' => 'immutable_datetime',
            'last_answered_at' => 'immutable_datetime',
            'failing_since' => 'immutable_datetime',
            'last_heartbeat_at' => 'immutable_datetime',
            'reported_failures' => DataCollection::class.':'.FailedHostCallData::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A host enrolled under its installation name, holding only the hash of its secret, its start roots and the
     * arrangement it runs agents in.
     *
     * @param  list<string>  $startRoots
     */
    public static function create(
        string $installationName,
        string $secret,
        array $startRoots,
        ArrangementType $arrangement,
    ): self {
        $host = new self();
        $host->installation_name = $installationName;
        $host->credential_hash = self::hashOf($secret);
        $host->start_roots = $startRoots;
        $host->arrangement = $arrangement;
        $host->order_secret = self::orderSecretOf($secret);
        $host->saveAndAssert();

        return $host;
    }

    // ----------[ Mutations ]----------

    /**
     * The host keeps the protection report given, in place of its earlier report of the same item.
     */
    public function recordProtection(ProtectionReport $report): void
    {
        $reports = $this->protection->items();
        $reports[$report->key()] = $report->data();
        $this->protection = ProtectionReportData::collect($reports, DataCollection::class);
        $this->saveAndAssert();
        $this->raise(new HostProtectionRecorded($this->id));
    }

    /**
     * The operator recorded a run that showed each item hold under the report key.
     *
     * @param  list<BoundaryItem>  $items
     */
    public function recordProtectionRuns(string $key, array $items, string $run): void
    {
        $runs = $this->protection_runs->items();

        foreach ($items as $item) {
            $runs[] = new ProtectionRunData($key, $item->value, $run);
        }

        $this->protection_runs = ProtectionRunData::collect($runs, DataCollection::class);
        $this->saveAndAssert();
        $this->raise(new HostProtectionRunsRecorded($this->id));
    }

    /**
     * The host's protocol 1 heartbeat arrived.
     */
    public function recordHeartbeat(CarbonImmutable $at): void
    {
        $this->last_heartbeat_at = $at;
        $this->saveAndAssert();
        $this->raise(new HostHeartbeatRecorded($this->id));
    }

    /**
     * Keeps a server error the journal answered one of the host's calls with: since when its calls fail, on which
     * route, and why the latest did.
     */
    public function recordCallFailure(string $route, int $status, string $reason, CarbonImmutable $at): void
    {
        $this->failing_since ??= $at;
        $this->failing_route ??= $route;
        $this->last_failure = "{$route} answered {$status}: {$reason}";
        $this->saveAndAssert();
        $this->raise(new HostCallFailed($this->id));
    }

    /**
     * Keeps that the journal answered one of the host's calls: an answer on the failing route ends the failure, and a
     * call the host reported failed on another route, such as one the journal stopped before it could answer, fails.
     *
     * @param  list<FailedHostCallData>  $reported
     */
    public function recordCallAnswered(string $route, array $reported, CarbonImmutable $at): void
    {
        $this->last_answered_at = $at;

        if ($route === $this->failing_route) {
            $this->failing_since = null;
            $this->failing_route = null;
            $this->last_failure = null;
        }

        foreach ($reported as $call) {
            if ($call->route !== $route) {
                $this->failing_since ??= CarbonImmutable::parse($call->since);
                $this->failing_route ??= $call->route;
                $this->last_failure = "{$call->route} answered {$call->status}: {$call->reason}";
            }
        }

        if ($reported !== []) {
            $this->reported_failures = FailedHostCallData::collect($reported, DataCollection::class);
        }

        $this->saveAndAssert();
        $this->raise(new HostCallAnswered($this->id));
    }

    /**
     * The host is revoked at the time given; its calls are refused from then on.
     */
    public function revokeAt(CarbonImmutable $time): void
    {
        $this->revoked_at = $time;
        $this->saveAndAssert();
        $this->raise(new HostRevoked($this->id));
    }

    // ----------[ Predicates ]----------

    /**
     * Whether the journal judged the protection kept under the report's key.
     */
    public function hasProtectionOf(ProtectionReport $unreported): bool
    {
        return array_key_exists($unreported->key(), $this->protection->items());
    }

    /**
     * Whether the host runs starts of this placement: a contained host in containers, a local one on the host.
     */
    public function runsPlacement(ExecutionModeType $placement): bool
    {
        return $this->arrangement->isContained() === ($placement === ExecutionModeType::RequiredContainer);
    }

    /**
     * Whether a browser may take control of this host's terminals: the host carries out the key orders the journal
     * types for it.
     */
    public function canCarryOutBrowserInput(): bool
    {
        return $this->carriesOut(HostOrderType::WriteKeys);
    }

    /**
     * Whether the host carries out the order this type of browser input becomes: keys for text, named keys and pastes,
     * a resize, or private entry.
     */
    public function carriesOutBrowserInputOf(TerminalInputType $inputType): bool
    {
        return $this->carriesOut(match ($inputType) {
            TerminalInputType::Resize => HostOrderType::Resize,
            TerminalInputType::Private => HostOrderType::OpenPrivate,
            default => HostOrderType::WriteKeys,
        });
    }

    /**
     * Whether the host is the relay of a project folder connected from a user's own machine, which runs its agents
     * there whatever this journal's own arrangement is: a binding names it, revoked or not.
     */
    public function isConnectedFolderRelay(): bool
    {
        return ProjectBinding::query()->acrossProjects()->onHost($this->id)->exists();
    }

    /**
     * Where this host runs a driver's executable from: a connected relay opens only the sealed copies its installer made,
     * and a contained host runs it from the agent image.
     */
    public function executablePlace(): ExecutablePlace
    {
        if ($this->isConnectedFolderRelay()) {
            return ExecutablePlace::Sealed;
        }

        if ($this->arrangement->isContained()) {
            return ExecutablePlace::Image;
        }

        return ExecutablePlace::Host;
    }

    /**
     * Whether a folder lies inside one of the roots this host may start in.
     */
    public function permitsFolder(string $folder): bool
    {
        foreach ($this->start_roots as $root) {
            $root = rtrim($root, '/');

            if ($folder === $root || str_starts_with($folder, $root.'/')) {
                return true;
            }
        }

        return false;
    }

    /**
     * Whether an answered call has anything to keep: a failure its route ends, failures the host reported, or a last
     * answer older than a minute, so a quiet host shows while a busy one writes its row once a minute.
     *
     * @param  list<FailedHostCallData>  $reported
     */
    public function hasAnswerToRecord(string $route, array $reported, CarbonImmutable $at): bool
    {
        return $route === $this->failing_route
            || $reported !== []
            || $this->last_answered_at === null
            || $this->last_answered_at->lt($at->subMinute());
    }

    /**
     * Keeps the order types the host's inventory says it carries out.
     *
     * @param  list<string>  $capabilities
     */
    public function recordCapabilities(array $capabilities): void
    {
        $this->capabilities = $capabilities;
        $this->saveAndAssert();
    }

    /**
     * Keeps the images the journal ordered this host to allow its containers, after the order was made.
     *
     * @param  list<string>  $images
     */
    public function allowImages(array $images): void
    {
        $this->allowed_images = $images;
        $this->saveAndAssert();
    }

    /**
     * A host that restarted allows no image until the journal orders it again.
     */
    public function forgetAllowedImages(): void
    {
        $this->allowImages([]);
    }

    /**
     * Whether the journal last ordered this host to allow exactly these images.
     *
     * @param  list<string>  $images
     */
    public function allowsImages(array $images): bool
    {
        return $this->allowed_images === $images;
    }

    /**
     * Keeps the release the host's inventory named; the release an upgrade waited on ends that upgrade.
     */
    public function recordRelease(string $release): void
    {
        $this->release = $release;

        if ($this->upgrade_release === $release) {
            $this->upgrade_release = null;
            $this->upgrade_order_id = null;
        }

        $this->saveAndAssert();
    }

    /**
     * The host is to move to the release once its processes ended; an earlier failure no longer stands.
     */
    public function awaitUpgrade(string $release): void
    {
        $this->upgrade_release = $release;
        $this->upgrade_order_id = null;
        $this->upgrade_failure = null;
        $this->saveAndAssert();
    }

    /**
     * Keeps the upgrade order the journal made for the awaited release.
     */
    public function orderUpgrade(string $orderId): void
    {
        $this->upgrade_order_id = $orderId;
        $this->saveAndAssert();
    }

    /**
     * The awaited upgrade failed for the reason given; the host stays on the release it runs.
     */
    public function failUpgrade(string $reason): void
    {
        $this->upgrade_release = null;
        $this->upgrade_order_id = null;
        $this->upgrade_failure = $reason;
        $this->saveAndAssert();
    }

    /**
     * Whether an upgrade waits for the host's processes to end and has no order yet.
     */
    public function awaitsUpgradeOrder(): bool
    {
        return $this->upgrade_release !== null && $this->upgrade_order_id === null;
    }

    /**
     * Whether the host carries out orders of the type: a host that sent no inventory yet is taken to carry out all.
     */
    public function carriesOut(HostOrderType $type): bool
    {
        return $this->capabilities === [] || in_array($type->value, $this->capabilities, true);
    }

    public function acceptsProtocol(int $protocol): bool
    {
        return $this->protocol === $protocol;
    }

    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }

    // ----------[ Transformers ]----------

    /**
     * The protection this host reported for the build the unreported report names, or that report when it has none.
     */
    public function protectionOf(ProtectionReport $unreported): ProtectionReport
    {
        $key = $unreported->key();

        $reports = $this->protection->items();

        if (! array_key_exists($key, $reports)) {
            return $unreported;
        }

        return $reports[$key]->report();
    }

    /**
     * The runs recorded on this host, by report key and item; a later run of an item replaces an earlier one.
     */
    public function protectionEvidence(): ProtectionEvidence
    {
        $runs = [];

        foreach ($this->protection_runs->items() as $recorded) {
            $runs[$recorded->key][$recorded->item] = $recorded->run;
        }

        return new ProtectionEvidence($runs);
    }

    // ----------[ Calculations ]----------

    /**
     * The order's signature the host checks: HMAC-SHA256, keyed by the host's order secret, of the order's id, number,
     * type, process, the SHA-256 of its payload and its expiry, one to a line.
     */
    public function signOrder(HostOrder $order): string
    {
        $lines = implode("\n", [
            $order->id,
            (string) $order->sequence,
            $order->type->value,
            (string) $order->host_process_id,
            hash('sha256', $order->payload),
            $order->expires_at->utc()->format('Y-m-d\\TH:i:s\\Z'),
        ]);

        return hash_hmac('sha256', $lines, (string) $this->order_secret);
    }

    /**
     * The folder a start the host was not asked for in a folder runs in: the first of its start roots; reading it on a
     * host with none fails.
     *
     * @throws HostUnavailable
     */
    public function startFolder(): string
    {
        $this->assertHasStartRoot();

        return $this->start_roots[0];
    }

    // ----------[ Accessors ]----------

    /**
     * The sentence a broken link of this host shows: since when its calls fail and why the latest did, or since when
     * it has been quiet.
     *
     * @return Attribute<non-falsy-string, never>
     */
    protected function linkAlarm(): Attribute
    {
        return Accessor::get(function (): string {
            if ($this->failing_since !== null) {
                return "The host {$this->installation_name} has failed to reach the journal since "
                    ."{$this->failing_since->format('H:i T')}: its last call, {$this->last_failure}.";
            }

            return "The host {$this->installation_name} has not called the journal since "
                ."{$this->last_answered_at?->format('H:i T')}.";
        });
    }

    /**
     * The sentence a host running another release than the journal's shows, with what the owner can do about it.
     *
     * @return non-falsy-string
     */
    public function releaseAlarm(string $journalRelease): string
    {
        return "The host {$this->installation_name} runs release {$this->release}, not the journal's {$journalRelease}: "
            .'run its install line again on that machine to bring it up to date.';
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a host that reports another arrangement than the one it was enrolled with.
     *
     * @throws HostArrangementRefused
     */
    public function assertEnrolledAs(ArrangementType $reported): void
    {
        if ($reported !== $this->arrangement) {
            throw HostArrangementRefused::unlikeEnrollment($reported, $this->arrangement);
        }
    }

    /**
     * Refuses the secret of a revoked host.
     *
     * @throws HostCredentialRejected
     */
    private function assertNotRevoked(): void
    {
        if ($this->isRevoked()) {
            throw HostCredentialRejected::revoked();
        }
    }

    /**
     * Refuses a start no serving host can run.
     *
     * @param  list<self>  $hosts  the serving hosts that can run it
     *
     * @throws HostUnavailable
     */
    private static function assertServesStart(array $hosts, string $driver, DriverType $driverType): void
    {
        if ($hosts === []) {
            throw HostUnavailable::forStart($driver, $driverType);
        }
    }

    /**
     * Refuses a host with no start folder declared.
     *
     * @throws HostUnavailable
     */
    private function assertHasStartRoot(): void
    {
        if (($this->start_roots[0] ?? null) === null) {
            throw HostUnavailable::withoutStartFolder($this->id);
        }
    }

    // ----------[ Internals ]----------

    /**
     * The stored form of a host secret: its hash, so the secret itself is never kept.
     */
    public static function hashOf(string $secret): string
    {
        return hash('sha256', $secret);
    }

    // ----------[ Queries ]----------

    /**
     * The secret the host's orders are signed with, worked out from its credential the way the host works it out, so
     * enrolment hands over nothing more.
     */
    public static function orderSecretOf(string $credential): string
    {
        return hash_hmac('sha256', self::ORDER_SECRET_CONTEXT, $credential);
    }

    /**
     * The host, locked until the transaction ends, so its host-wide orders are numbered one at a time.
     */
    public static function findLocked(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    /**
     * The hosts whose heartbeat went silent before the moment and that show no failure yet.
     *
     * @return list<self>
     */
    public static function findSilentSince(CarbonImmutable $since): array
    {
        return array_values(self::query()->unrevoked()->silentSince($since)->lockForUpdate()->get()->all());
    }

    /**
     * The hosts, locked, whose awaited upgrade order was answered done before the moment while no inventory has named
     * the release it brings.
     *
     * @return list<self>
     */
    public static function findUpgradesAnsweredDoneBefore(CarbonImmutable $before): array
    {
        return array_values(self::query()->unrevoked()
            ->whereNotNull('upgrade_release')
            ->whereIn('upgrade_order_id', HostOrder::query()->answeredDoneBefore($before)->select('id'))
            ->lockForUpdate()
            ->get()
            ->all());
    }

    /**
     * The host a secret belongs to, if it is enrolled and not revoked.
     *
     * @throws HostCredentialRejected
     */
    public static function findForSecret(string $secret): self
    {
        $host = self::query()->withSecret($secret)->firstOr(HostCredentialRejected::throwing()->unknown());
        $host->assertNotRevoked();

        return $host;
    }

    /**
     * The protection a contained host of this installation last reported for the driver's build on the platform a
     * start profile names, or the unreported one asked for when no contained host has.
     */
    public static function resolveContainedProtectionOf(ProtectionReport $unreported): ProtectionReport
    {
        $host = self::query()
            ->contained()
            ->unrevoked()
            ->recentlyUpdatedFirst()
            ->first();

        if ($host === null) {
            return $unreported;
        }

        return $host->protectionOf($unreported);
    }

    /**
     * The enrolled hosts that are not revoked; an installation has a handful.
     *
     * @return list<self>
     */
    public static function findServingEnrolled(): array
    {
        return array_values(
            self::query()
                ->unrevoked()
                ->enrolled()
                ->readAll('an installation enrolls a handful of hosts')
                ->get()
                ->all(),
        );
    }

    /**
     * Where a main start of an agent of the project runs: for the local project the first serving enrolled host that
     * runs this placement, in its start folder; for a connected project the relay host of one of its serving bindings,
     * in that binding's folder. The journal proves the driver's build on that host before the start runs.
     *
     * @throws HostUnavailable
     * @throws StartRefused when no folder of the connected project serves it now
     */
    public static function findRunningStart(
        Project $project,
        string $driver,
        ExecutionModeType $placement,
        DriverType $driverType,
    ): StartPlace {
        if (! $project->isLocal()) {
            $binding = ProjectBinding::findServingStart($project, $placement);

            return new StartPlace($binding->host_id, $binding->canonical_root);
        }

        $hosts = array_values(array_filter(
            self::findServingEnrolled(),
            fn (self $host) => $host->runsPlacement($placement),
        ));

        self::assertServesStart($hosts, $driver, $driverType);

        return new StartPlace($hosts[0]->id, $hosts[0]->startFolder());
    }

    // ----------[ Scopes ]----------

    /**
     * Hosts enrolled to run this journal's own agents: no project binding names them, so none is a folder's relay.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function enrolled(Builder $query): void
    {
        $query->whereNotExists(
            fn (QueryBuilder $bindings) => $bindings
                ->from('project_bindings')
                ->whereColumn('project_bindings.host_id', 'hosts.id'),
        );
    }

    /**
     * The host that holds the secret.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withSecret(Builder $query, string $secret): void
    {
        $query->where('credential_hash', self::hashOf($secret));
    }

    /**
     * The hosts that run agents in containers.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function contained(Builder $query): void
    {
        $query->where('arrangement', ArrangementType::Contained);
    }

    /**
     * The hosts not revoked.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unrevoked(Builder $query): void
    {
        $query->whereNull('revoked_at');
    }

    /**
     * The hosts most recently updated first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function recentlyUpdatedFirst(Builder $query): void
    {
        $query->latest('updated_at');
    }

    /**
     * The rows by failing since.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byFailingSince(Builder $query): void
    {
        $query->orderBy('failing_since');
    }

    /**
     * The hosts whose calls fail, or that answered nothing since the cutoff.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unreachableSince(Builder $query, CarbonImmutable $cutoff): void
    {
        $query->where(
            fn (Builder $hosts) => $hosts->whereNotNull('failing_since')->orWhere('last_answered_at', '<', $cutoff),
        );
    }

    /**
     * The hosts failing since before the first moment, and the contained hosts that answered nothing since the second.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function failingOrQuiet(Builder $query, CarbonImmutable $failingSince, CarbonImmutable $quietSince): void
    {
        $query->where(fn (Builder $hosts) => $hosts
            ->where('failing_since', '<', $failingSince)
            ->orWhere(fn (Builder $quiet) => $quiet
                ->where('arrangement', ArrangementType::Contained)
                ->where('last_answered_at', '<', $quietSince)));
    }

    /**
     * The hosts whose inventory named a release other than the given one.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function runningAnotherReleaseThan(Builder $query, string $release): void
    {
        $query->whereNotNull('release')->where('release', '!=', $release);
    }

    /**
     * The hosts whose heartbeat went silent before the moment and that show no failure yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function silentSince(Builder $query, CarbonImmutable $since): void
    {
        $query->where('last_heartbeat_at', '<', $since)->whereNull('failing_since');
    }
}
