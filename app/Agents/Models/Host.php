<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Enums\ArrangementType;
use App\Agents\Enums\DriverVariant;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Exceptions\HostArrangementRefused;
use App\Agents\Exceptions\HostCredentialRejected;
use App\Agents\Exceptions\HostUnavailable;
use App\Agents\Values\HostCombination;
use App\Agents\Values\ProtectionReport;
use App\Agents\Values\StartProposal;
use App\Drivers\Enums\HookDriver;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A machine enrolled to run agent programs: an infrastructure principal with its own credential, never an actor.
 *
 * @phpstan-import-type StoredReport from ProtectionReport
 *
 * @property string $id
 * @property string $installation_name
 * @property string $credential_hash
 * @property list<string> $start_roots
 * @property ArrangementType $arrangement
 * @property array<string, StoredReport> $protection
 * @property int|null $protocol_version
 * @property list<array{driver: string, build: string, arrangement: string, placement: string, variant: string}> $combinations
 * @property CarbonImmutable|null $revoked_at
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
            'combinations' => 'array',
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
     * The protection a contained host of this installation last reported for the program's build on the platform a
     * launch profile names, or an unreported one when no contained host has.
     */
    public static function containedProtectionOf(HookDriver $driver, string $build, string $platform): ProtectionReport
    {
        $host = self::query()
            ->where('arrangement', ArrangementType::Contained)
            ->whereNull('revoked_at')
            ->latest('updated_at')
            ->first();

        if ($host === null) {
            return ProtectionReport::unreported($driver, $build, $platform);
        }

        return $host->protectionOf($driver, $build, $platform);
    }

    /**
     * The enrolled hosts that are not revoked; an installation has a handful.
     *
     * @return list<self>
     */
    public static function serving(): array
    {
        return array_values(
            self::query()->whereNull('revoked_at')->readAll('an installation enrolls a handful of hosts')->get()->all(),
        );
    }

    /**
     * The first serving host that runs this placement, speaks this protocol and declared the driver build and variant.
     *
     * @throws HostUnavailable
     */
    public static function runningStart(
        HookDriver $driver,
        string $build,
        ExecutionModeType $placement,
        DriverVariant $variant,
    ): self {
        foreach (self::serving() as $host) {
            if ($host->runsPlacement($placement) && $host->speaksCurrentProtocol()
                && $host->declaresCombination($driver, $build, $placement, $variant)) {
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
     * Keeps the protocol version the host speaks and the combinations it reported it can run, in place of the ones it
     * reported before.
     *
     * @param  list<array{driver: string, build: string, arrangement: string, placement: string, variant: string}>  $combinations
     */
    public function recordCombinations(int $protocolVersion, array $combinations): void
    {
        $this->protocol_version = $protocolVersion;
        $this->combinations = $combinations;
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

    public function speaksCurrentProtocol(): bool
    {
        return $this->protocol_version === HostProtocolVersion::current()->value;
    }

    /**
     * Whether the host reported it can run the proposed driver build, in its own arrangement, placement and variant.
     */
    public function declares(StartProposal $proposal): bool
    {
        return $this->declaresCombination($proposal->driver, $proposal->build, $proposal->placement, $proposal->variant);
    }

    /**
     * Whether the host reported it can run this driver build, in its own arrangement, the placement and the variant.
     */
    public function declaresCombination(
        HookDriver $driver,
        string $build,
        ExecutionModeType $placement,
        DriverVariant $variant,
    ): bool {
        $combination = new HostCombination($driver, $build, $this->arrangement, $placement, $variant);

        return in_array($combination->stored(), $this->combinations, false);
    }

    /**
     * Whether the host reported it can run the program at all, in any build, placement or variant.
     */
    public function declaresDriver(HookDriver $driver): bool
    {
        foreach ($this->combinations as $combination) {
            if ($combination['driver'] === $driver->value) {
                return true;
            }
        }

        return false;
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

    public function protectionOf(HookDriver $driver, string $build, string $platform): ProtectionReport
    {
        $key = ProtectionReport::keyOf($driver, $build, $platform);

        if (! array_key_exists($key, $this->protection)) {
            return ProtectionReport::unreported($driver, $build, $platform);
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
}
