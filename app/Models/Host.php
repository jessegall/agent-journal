<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\ArrangementType;
use App\Enums\DriverVariant;
use App\Enums\ExecutionModeType;
use App\Enums\TerminalInputType;
use App\Exceptions\HostArrangementRefused;
use App\Exceptions\HostCredentialRejected;
use App\Exceptions\HostUnavailable;
use App\Values\BrowserInputCapabilities;
use App\Values\ProtectionReport;
use App\Values\StartProposal;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
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
 * @property list<array{key: string, build: string, arrangement: string, placement: string, family: string|null, mode: string|null, unavailable_reason: string|null}> $descriptors
 * @property CarbonImmutable|null $revoked_at
 * @property bool $browser_input
 * @property bool $browser_keys
 * @property bool $browser_paste
 * @property bool $browser_resize
 * @property bool $browser_private
 */
#[Fillable(['installation_name', 'credential_hash', 'start_roots', 'arrangement'])]
final class Host extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

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
        ];
    }

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
        $host = self::query()->where(
            'credential_hash',
            self::hashOf($secret),
        )->firstOr(fn () => throw HostCredentialRejected::unknown());

        return $host->isRevoked() ? throw HostCredentialRejected::revoked() : $host;
    }

    /**
     * The protection a contained host of this installation last reported for the driver's build on the platform a
     * launch profile names, or the unreported one asked for when no contained host has.
     */
    public static function containedProtectionOf(ProtectionReport $unreported): ProtectionReport
    {
        $host = self::query()
            ->where('arrangement', ArrangementType::Contained)
            ->whereNull('revoked_at')
            ->latest('updated_at')
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
                ->whereNull('revoked_at')
                ->enrolled()
                ->readAll('an installation enrolls a handful of hosts')
                ->get()
                ->all(),
        );
    }

    /**
     * The first serving enrolled host that runs this placement and declared the driver build and variant; a relay
     * host starts only through its binding.
     *
     * @throws HostUnavailable
     */
    public static function runningStart(
        string $driver,
        string $build,
        ExecutionModeType $placement,
        DriverVariant $variant,
    ): self {
        foreach (self::servingEnrolled() as $host) {
            if ($host->runsPlacement($placement) && $host->declaresRun($driver, $build, $placement, $variant)) {
                return $host;
            }
        }

        throw HostUnavailable::forStart($driver, $variant);
    }

    // ----------[ Mutations ]----------

    public function recordProtection(ProtectionReport $report): void
    {
        $this->protection = [...$this->protection, $report->key() => $report->stored()];
        $this->save();
    }

    /**
     * Keeps the drivers the host enrolled, in place of the ones it enrolled before.
     *
     * @param  list<array{key: string, build: string, arrangement: string, placement: string, family: string|null, mode: string|null, unavailable_reason: string|null}>  $descriptors
     */
    public function recordDescriptors(array $descriptors): void
    {
        $this->descriptors = $descriptors;
        $this->save();
    }

    /**
     * Keeps which browser input the host's latest claim says it carries out on its terminals.
     */
    public function advertiseBrowserInput(BrowserInputCapabilities $capabilities): void
    {
        $this->browser_input = $capabilities->text;
        $this->browser_keys = $capabilities->keys;
        $this->browser_paste = $capabilities->paste;
        $this->browser_resize = $capabilities->resize;
        $this->browser_private = $capabilities->privateEntry;

        if (! $this->isDirty(['browser_input', 'browser_keys', 'browser_paste', 'browser_resize', 'browser_private'])) {
            return;
        }

        $this->save();
    }

    public function revokeAt(CarbonImmutable $time): void
    {
        $this->revoked_at = $time;
        $this->save();
    }

    // ----------[ Answers ]----------

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
        return ProjectBinding::query()->where('host_id', $this->id)->exists();
    }

    /**
     * Whether the host enrolled the proposed driver build as available, in its own arrangement, placement and mode.
     */
    public function declares(StartProposal $proposal): bool
    {
        return $this->declaresRun($proposal->driver, $proposal->build, $proposal->placement, $proposal->variant);
    }

    /**
     * Whether the host enrolled this driver build as available, in its own arrangement, the placement and the mode.
     */
    public function declaresRun(string $driver, string $build, ExecutionModeType $placement, DriverVariant $mode): bool
    {
        foreach ($this->availableDescriptors() as $descriptor) {
            if ($descriptor['family'] === $driver
                && $descriptor['mode'] === $mode->value
                && $descriptor['build'] === $build
                && $descriptor['arrangement'] === $this->arrangement->value
                && $descriptor['placement'] === $placement->value) {
                return true;
            }
        }

        return false;
    }

    /**
     * Whether the host enrolled any available driver of the family, in any build, placement or mode.
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
     * @return list<array{key: string, build: string, arrangement: string, placement: string, family: string|null, mode: string|null, unavailable_reason: string|null}>
     */
    private function availableDescriptors(): array
    {
        return array_values(array_filter(
            $this->descriptors,
            fn (array $descriptor) => $descriptor['unavailable_reason'] === null,
        ));
    }

    /**
     * The folder a start the host was not asked for in a folder runs in: the first of its start roots.
     *
     * @throws HostUnavailable
     */
    public function startFolder(): string
    {
        return $this->start_roots[0] ?? throw HostUnavailable::withoutStartFolder($this->id);
    }

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

    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
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
}
