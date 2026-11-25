<?php

declare(strict_types=1);

namespace App\Models\Profiles;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Contracts\Records\ReadableModel;
use App\Data\Profiles\RevokedPatternData;
use App\Enums\CommandClass;
use App\Support\ActorIdentity;
use App\Values\CommandClassSet;
use App\Values\CommandPattern;
use App\Values\CommandPatternSet;
use App\Values\CommandPermissions;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Spatie\LaravelData\DataCollection;

/**
 * Classes and exact commands taken away from a permission source, such as a role; every later admission is narrowed
 * by them. Broadening again needs a new prepared session.
 *
 * @property string $id
 * @property string $permission_source
 * @property list<string> $revoked_classes
 * @property DataCollection<int, RevokedPatternData> $revoked_patterns
 * @property string $revoked_by_type
 * @property string $revoked_by_id
 * @property CarbonImmutable $revoked_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(
    [
        'permission_source',
        'revoked_classes',
        'revoked_patterns',
        'revoked_by_type',
        'revoked_by_id',
        'revoked_at',
    ],
)]
final class PermissionRevocation extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'revoked_classes' => 'array',
            'revoked_patterns' => DataCollection::class.':'.RevokedPatternData::class,
            'revoked_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    public static function create(
        string $source,
        CommandClassSet $classes,
        CommandPatternSet $patterns,
        ActorIdentity $by,
    ): self {
        return self::query()->create([
            'permission_source' => $source,
            'revoked_classes' => array_map(fn (CommandClass $class) => $class->value, $classes->classes),
            'revoked_patterns' => array_map(fn (CommandPattern $pattern) => new RevokedPatternData($pattern->words), $patterns->patterns),
            'revoked_by_type' => $by->type->value,
            'revoked_by_id' => $by->id,
            'revoked_at' => CarbonImmutable::now(),
        ]);
    }

    // ----------[ Queries ]----------

    /**
     * The permissions narrowed by every revocation of their source.
     */
    public static function narrow(CommandPermissions $permissions): CommandPermissions
    {
        self::query()->ofSource($permissions->source)->oldestFirst()->readInChunks(200, function (Collection $revocations) use (&$permissions): void {
            foreach ($revocations as $revocation) {
                $permissions = $permissions->revoking(
                    CommandClassSet::of(...array_map(CommandClass::from(...), $revocation->revoked_classes)),
                    CommandPatternSet::of(...array_map(
                        fn (RevokedPatternData $pattern) => CommandPattern::fromArray($pattern->words),
                        $revocation->revoked_patterns->all(),
                    )),
                );
            }
        });

        return $permissions;
    }

    // ----------[ Scopes ]----------

    /**
     * The revocations of the permission source.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofSource(Builder $query, string $source): void
    {
        $query->where('permission_source', $source);
    }
}
