<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Exceptions\HostCredentialRejected;
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
 * @property string $id
 * @property string $installation_name
 * @property string $credential_hash
 * @property list<string> $start_roots
 * @property CarbonImmutable|null $revoked_at
 */
#[Fillable(['installation_name', 'credential_hash', 'start_roots'])]
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
            'start_roots' => 'array',
            'revoked_at' => 'immutable_datetime',
        ];
    }

    /**
     * A host enrolled under its installation name, holding only the hash of its secret and its start roots.
     *
     * @param  list<string>  $startRoots
     */
    public static function enroll(string $installationName, string $secret, array $startRoots): self
    {
        return self::query()->create([
            'installation_name' => $installationName,
            'credential_hash' => self::hashOf($secret),
            'start_roots' => $startRoots,
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

    // ----------[ Mutations ]----------

    public function revokeAt(CarbonImmutable $time): void
    {
        $this->revoked_at = $time;
        $this->save();
    }

    // ----------[ Answers ]----------

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

    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }
}
