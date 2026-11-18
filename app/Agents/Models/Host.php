<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Exceptions\HostCredentialRejected;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use App\Links\Support\Linkable;
use App\Reads\Support\BoundedReads;
use App\Reads\Contracts\ReadableModel;

/**
 * A machine enrolled to run agent programs: an infrastructure principal with its own credential, never an actor.
 *
 * @property string $id
 * @property string $installation_name
 * @property string $credential_hash
 * @property list<string> $launch_roots
 * @property CarbonImmutable|null $revoked_at
 */
#[Fillable(['installation_name', 'credential_hash', 'launch_roots'])]
final class Host extends Model implements ReadableModel
{
    use BoundedReads;
    use Linkable;
    use HasUlids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'launch_roots' => 'array',
            'revoked_at' => 'immutable_datetime',
        ];
    }

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
        $host = self::query()->where('credential_hash', self::hashOf($secret))->first() ?? throw HostCredentialRejected::unknown();

        return $host->isRevoked() ? throw HostCredentialRejected::revoked() : $host;
    }

    /**
     * Whether a folder lies inside one of the roots this host may launch in.
     */
    public function permitsFolder(string $folder): bool
    {
        foreach ($this->launch_roots as $root) {
            $root = rtrim($root, '/');
            if ($folder === $root || str_starts_with($folder, $root.'/')) {
                return true;
            }
        }

        return false;
    }

    public function revokeAt(CarbonImmutable $time): void
    {
        $this->revoked_at = $time;
        $this->save();
    }

    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }
}
