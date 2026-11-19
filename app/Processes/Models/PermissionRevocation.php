<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Processes\Enums\CommandClass;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandPattern;
use App\Processes\Values\CommandPatternSet;
use App\Processes\Values\CommandPermissions;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Classes and exact commands taken away from a permission source, such as a role; every later admission is narrowed
 * by them. Broadening again needs a new prepared session.
 *
 * @property string $id
 * @property string $permission_source
 * @property list<string> $revoked_classes
 * @property list<list<string>> $revoked_patterns
 * @property string $revoked_by_type
 * @property string $revoked_by_id
 * @property CarbonImmutable $revoked_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(
    ['permission_source', 'revoked_classes', 'revoked_patterns', 'revoked_by_type', 'revoked_by_id', 'revoked_at'],
)]
final class PermissionRevocation extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['revoked_classes' => 'array', 'revoked_patterns' => 'array', 'revoked_at' => 'immutable_datetime'];
    }

    public static function revoke(
        string $source,
        CommandClassSet $classes,
        CommandPatternSet $patterns,
        ActorIdentity $by,
    ): self {
        return self::query()->create([
            'permission_source' => $source,
            'revoked_classes' => array_map(fn (CommandClass $class) => $class->value, $classes->classes),
            'revoked_patterns' => array_map(fn (CommandPattern $pattern) => $pattern->toArray(), $patterns->patterns),
            'revoked_by_type' => $by->type->value,
            'revoked_by_id' => $by->id,
            'revoked_at' => CarbonImmutable::now(),
        ]);
    }

    /**
     * The permissions narrowed by every revocation of their source.
     */
    public static function narrow(CommandPermissions $permissions): CommandPermissions
    {
        self::query()->where(
            'permission_source',
            $permissions->source,
        )->orderBy('id')->readInChunks(200, function (Collection $revocations) use (&$permissions): void {
            foreach ($revocations as $revocation) {
                $permissions = $permissions->revoking(
                    CommandClassSet::of(...array_map(CommandClass::from(...), $revocation->revoked_classes)),
                    CommandPatternSet::of(...array_map(CommandPattern::fromArray(...), $revocation->revoked_patterns)),
                );
            }
        });

        return $permissions;
    }
}
