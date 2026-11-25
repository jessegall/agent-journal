<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ArrangementType;
use App\Enums\DriverType;
use App\Enums\ExecutionModeType;
use App\Enums\TerminalInputType;
use App\Events\Connections\HostBrowserInputAdvertised;
use App\Events\Connections\HostCallAnswered;
use App\Events\Connections\HostCallFailed;
use App\Events\Connections\HostDescriptorsRecorded;
use App\Events\Connections\HostProtectionRecorded;
use App\Events\Connections\HostRevoked;
use App\Exceptions\HostArrangementRefused;
use App\Exceptions\HostCredentialRejected;
use App\Exceptions\HostUnavailable;
use App\Values\BrowserInputCapabilities;
use App\Values\FailedHostCall;
use App\Values\ProtectionReport;
use App\Values\StartProposal;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * A machine enrolled to run agent drivers: an infrastructure principal with its own credential, never an actor.
 *
 * @phpstan-import-type StoredReport from ProtectionReport
 *
 * @property string $id
 * @property string $installation_name
 * @property string $credential_hash
 * @property list<string> $start_roots
 * @property ArrangementType $arrangement
 * @property array<string, StoredReport> $protection
 * @property list<array{key: string, build: string, arrangement: string, placement: string, family: string|null, driver_type: string|null, unavailable_reason: string|null}> $descriptors
 * @property CarbonImmutable|null $revoked_at
 * @property CarbonImmutable|null $last_answered_at
 * @property CarbonImmutable|null $failing_since
 * @property string|null $failing_route
 * @property string|null $last_failure
 * @property list<array{route: string, status: int, reason: string, since: string}>|null $reported_failures
 * @property bool $browser_input
 * @property bool $browser_keys
 * @property bool $browser_paste
 * @property bool $browser_resize
 * @property bool $browser_private
 */
#[Fillable([
    'installation_name',
    'credential_hash',
    'start_roots',
    'arrangement',
])]
final class Host extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'arrangement' => ArrangementType::class,
            'start_roots' => 'array',
            'protection' => 'array',
            'descriptors' => 'array',
            'browser_input' => 'boolean',
            'browser_keys' => 'boolean',
            'browser_paste' => 'boolean',
            'browser_resize' => 'boolean',
            'browser_private' => 'boolean',
            'revoked_at' => 'immutable_datetime',
            'last_answered_at' => 'immutable_datetime',
            'failing_since' => 'immutable_datetime',
            'reported_failures' => 'array',
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
        return self::query()->create([
            'installation_name' => $installationName,
            'credential_hash' => self::hashOf($secret),
            'start_roots' => $startRoots,
            'arrangement' => $arrangement,
        ]);
    }

    // ----------[ Mutations ]----------

    public function recordProtection(ProtectionReport $report): void
    {
        $this->protection = [
            ...$this->protection,
            $report->key() => $report->stored(),
        ];
        $this->assertSaved($this->save());
        $this->raise(new HostProtectionRecorded($this->id));
    }

    /**
     * Keeps the drivers the host enrolled, in place of the ones it enrolled before.
     *
     * @param  list<array{key: string, build: string, arrangement: string, placement: string, family: string|null, driver_type: string|null, unavailable_reason: string|null}>  $descriptors
     */
    public function recordDescriptors(array $descriptors): void
    {
        $this->descriptors = $descriptors;
        $this->assertSaved($this->save());
        $this->raise(new HostDescriptorsRecorded($this->id));
    }

    /**
     * Keeps which browser input the host's latest claim says it carries out on its terminals.
     */
    public function advertiseBrowserInput(BrowserInputCapabilities $capabilities): void
    {
        $this->browser_input = $capabilities->isText;
        $this->browser_keys = $capabilities->keys;
        $this->browser_paste = $capabilities->shouldPaste;
        $this->browser_resize = $capabilities->shouldResize;
        $this->browser_private = $capabilities->isPrivateEntry;

        if (! $this->isDirty([
            'browser_input',
            'browser_keys',
            'browser_paste',
            'browser_resize',
            'browser_private',
        ])) {
            return;
        }

        $this->assertSaved($this->save());
        $this->raise(new HostBrowserInputAdvertised($this->id));
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
        $this->assertSaved($this->save());
        $this->raise(new HostCallFailed($this->id));
    }

    /**
     * Keeps that the journal answered one of the host's calls: an answer on the failing route ends the failure, and a
     * call the host reported failed on another route, such as one the journal stopped before it could answer, fails.
     *
     * @param  list<FailedHostCall>  $reported
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
            $this->reported_failures = array_map(fn (FailedHostCall $call) => $call->toArray(), $reported);
        }

        $this->assertSaved($this->save());
        $this->raise(new HostCallAnswered($this->id));
    }

    public function revokeAt(CarbonImmutable $time): void
    {
        $this->revoked_at = $time;
        $this->assertSaved($this->save());
        $this->raise(new HostRevoked($this->id));
    }

    // ----------[ Predicates ]----------

    /**
     * Whether the host runs starts of this placement: a contained host in containers, a local one on the host.
     */
    public function runsPlacement(ExecutionModeType $placement): bool
    {
        return $this->arrangement->isContained() === ($placement === ExecutionModeType::RequiredContainer);
    }

    /**
     * Whether a browser may take control of this host's terminals; a host that never said so is watch-only.
     */
    public function canCarryOutBrowserInput(): bool
    {
        return $this->browser_input;
    }

    /**
     * Whether the host carries out this type of browser input: text, named keys or pastes.
     */
    public function carriesOutBrowserInputOf(TerminalInputType $inputType): bool
    {
        $capabilities = new BrowserInputCapabilities(
            $this->browser_input,
            $this->browser_keys,
            $this->browser_paste,
            $this->browser_resize,
            $this->browser_private,
        );

        return $capabilities->carriesOut($inputType);
    }

    /**
     * Whether the host is the relay of a project folder connected from a user's own machine, which runs its agents
     * there whatever this journal's own arrangement is: a binding names it, revoked or not.
     */
    public function isConnectedFolderRelay(): bool
    {
        return ProjectBinding::query()->onHost($this->id)->exists();
    }

    /**
     * Whether the host enrolled the proposed driver build as available, in its own arrangement, placement and driver
     * type.
     */
    public function declares(StartProposal $proposal): bool
    {
        return $this->declaresRun($proposal->driver, $proposal->build, $proposal->placement, $proposal->driverType);
    }

    /**
     * Whether the host enrolled this driver build as available, in its own arrangement, the placement and the driver
     * type.
     */
    public function declaresRun(
        string $driver,
        string $build,
        ExecutionModeType $placement,
        DriverType $driverType,
    ): bool {
        foreach ($this->availableDescriptors() as $descriptor) {
            if ($descriptor['family'] === $driver
                && $descriptor['driver_type'] === $driverType->value
                && $descriptor['build'] === $build
                && $descriptor['arrangement'] === $this->arrangement->value
                && $descriptor['placement'] === $placement->value) {
                return true;
            }
        }

        return false;
    }

    /**
     * Whether the host enrolled any available driver of the family, in any build, placement or driver type.
     */
    public function declaresDriver(string $family): bool
    {
        foreach ($this->availableDescriptors() as $descriptor) {
            if ($descriptor['family'] === $family) {
                return true;
            }
        }

        return false;
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
     * @param  list<FailedHostCall>  $reported
     */
    public function hasAnswerToRecord(string $route, array $reported, CarbonImmutable $at): bool
    {
        return $route === $this->failing_route
            || $reported !== []
            || $this->last_answered_at === null
            || $this->last_answered_at->lt($at->subMinute());
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

        if (! array_key_exists($key, $this->protection)) {
            return $unreported;
        }

        return ProtectionReport::fromStored($this->protection[$key]);
    }

    // ----------[ Calculations ]----------

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
        return Attribute::get(function (): string {
            if ($this->failing_since !== null) {
                return "The host {$this->installation_name} has failed to reach the journal since "
                    ."{$this->failing_since->format('H:i T')}: its last call, {$this->last_failure}.";
            }

            return "The host {$this->installation_name} has not called the journal since "
                ."{$this->last_answered_at?->format('H:i T')}.";
        });
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
     * @return list<array{key: string, build: string, arrangement: string, placement: string, family: string|null, driver_type: string|null, unavailable_reason: string|null}>
     */
    private function availableDescriptors(): array
    {
        return array_values(array_filter(
            $this->descriptors,
            fn (array $descriptor) => $descriptor['unavailable_reason'] === null,
        ));
    }

    // ----------[ Queries ]----------

    /**
     * The stored form of a host secret: its hash, so the secret itself is never kept.
     */
    public static function hashOf(string $secret): string
    {
        return hash('sha256', $secret);
    }

    /**
     * The host a secret belongs to, if it is enrolled and not revoked.
     *
     * @throws HostCredentialRejected
     */
    public static function forSecret(string $secret): self
    {
        $host = self::query()->withSecret($secret)->firstOr(HostCredentialRejected::throwing()->unknown());
        $host->assertNotRevoked();

        return $host;
    }

    /**
     * The protection a contained host of this installation last reported for the driver's build on the platform a
     * launch profile names, or the unreported one asked for when no contained host has.
     */
    public static function containedProtectionOf(ProtectionReport $unreported): ProtectionReport
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
    public static function servingEnrolled(): array
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
     * The first serving enrolled host that runs this placement and declared the driver build and driver type; a relay
     * host starts only through its binding.
     *
     * @throws HostUnavailable
     */
    public static function runningStart(
        string $driver,
        string $build,
        ExecutionModeType $placement,
        DriverType $driverType,
    ): self {
        $hosts = array_values(array_filter(
            self::servingEnrolled(),
            fn (self $host) => $host->runsPlacement($placement) && $host->declaresRun($driver, $build, $placement, $driverType),
        ));
        self::assertServesStart($hosts, $driver, $driverType);

        return $hosts[0];
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
}
