<?php

declare(strict_types=1);

namespace App\Models\Profiles;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Contracts\Records\ReadableModel;
use App\Data\Profiles\RevokedPatternData;
use App\Enums\CommandRules\CommandClass;
use App\Support\ActorIdentity;
use App\Values\CommandClassSet;
use App\Values\CommandPattern;
use App\Values\CommandPatternSet;
use App\Values\CommandPermissions;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $permission_source
 * @property array $revoked_classes
 * @property RevokedPatternData[]|DataCollection<array-key, RevokedPatternData> $revoked_patterns
 * @property string $revoked_by_type
 * @property string $revoked_by_id
 * @property CarbonImmutable $revoked_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
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
        $permissionRevocation = new self();
        $permissionRevocation->permission_source = $source;
        $permissionRevocation->revoked_classes = array_map(fn (CommandClass $class) => $class->value, $classes->classes);
        $permissionRevocation->revoked_patterns = array_map(fn (CommandPattern $pattern) => new RevokedPatternData($pattern->words), $patterns->patterns);
        $permissionRevocation->revoked_by_type = $by->type;
        $permissionRevocation->revoked_by_id = $by->id;
        $permissionRevocation->revoked_at = CarbonImmutable::now();
        $permissionRevocation->save();

        return $permissionRevocation;
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
                        fn (RevokedPatternData $pattern) => CommandPattern::ofWords($pattern->words),
                        $revocation->revoked_patterns->items(),
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
