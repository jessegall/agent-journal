<?php

declare(strict_types=1);

namespace App\Models\Notifications;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\Notifications\NotificationMutationType;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $scope_id
 * @property int $version
 * @property string $receipt_id
 * @property NotificationMutationType $mutation_type
 * @property int $sequence
 * @property CarbonImmutable|null $created_at
 *
 * @mixin \Eloquent
 */
#[Table('notification_changes')]
final class NotificationChange extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const ?string UPDATED_AT = null;

    /**
     * How long changes are kept for catching up; an older cursor takes a fresh snapshot instead.
     */
    public const int RETAINED_HOURS = 24;

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'version' => 'integer',
            'mutation_type' => NotificationMutationType::class,
            'sequence' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The change the scope's latest mutation made to the receipt, under the scope's lock.
     */
    public static function create(
        NotificationScope $scope,
        NotificationReceipt $receipt,
        NotificationMutationType $type,
    ): self {
        $change = new self();
        $change->scope_id = $scope->id;
        $change->version = $scope->mutation_version;
        $change->receipt_id = $receipt->id;
        $change->mutation_type = $type;
        $change->sequence = $receipt->sequence;

        $change->save();

        return $change;
    }

    // ----------[ Queries ]----------

    /**
     * The scope's changes after one version up to another, oldest first, at most the limit.
     *
     * @return list<self>
     */
    public static function findBetween(string $scopeId, int $afterVersion, int $throughVersion, int $limit): array
    {
        return array_values(self::query()
            ->ofScope($scopeId)
            ->versionedBetween($afterVersion, $throughVersion)
            ->inVersionOrder()
            ->readUpTo($limit)
            ->get()
            ->all());
    }

    /**
     * The oldest version the scope still keeps a change of, when it keeps any.
     *
     * @return Option<int>
     */
    public static function resolveOldestVersionOf(string $scopeId): Option
    {
        $version = self::query()->ofScope($scopeId)->min('version');

        return Option::fromValue($version === null ? null : (int) $version);
    }

    // ----------[ Scopes ]----------

    /**
     * The scope's changes.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofScope(Builder $query, string $scopeId): void
    {
        $query->where('scope_id', $scopeId);
    }

    /**
     * The changes after the one version, through the other.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function versionedBetween(Builder $query, int $afterVersion, int $throughVersion): void
    {
        $query->where('version', '>', $afterVersion)->where('version', '<=', $throughVersion);
    }

    /**
     * The changes in the order of their version.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inVersionOrder(Builder $query): void
    {
        $query->orderBy('version');
    }

    /**
     * The rows of any of the given ids.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function withAnyId(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('id', $ids);
    }

    /**
     * The rows by created at.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byCreatedAt(Builder $query): void
    {
        $query->orderBy('created_at');
    }

    /**
     * The changes made before the moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function createdBefore(Builder $query, CarbonImmutable $moment): void
    {
        $query->where('created_at', '<', $moment);
    }
}
