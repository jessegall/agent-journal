<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Communication\Enums\NotificationMutationType;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\Option;

/**
 * One change of one receipt in a scope, at the scope's version after it, so a browser can catch up in order: which
 * receipt, what happened and its arrival sequence, never its title. Kept for a day.
 *
 * @property string $id
 * @property string $scope_id
 * @property int $version
 * @property string $receipt_id
 * @property NotificationMutationType $mutation_type
 * @property int $sequence
 * @property CarbonImmutable|null $created_at
 */
#[Table('notification_changes')]
#[Fillable(['scope_id', 'version', 'receipt_id', 'mutation_type', 'sequence'])]
final class NotificationChange extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;

    public const ?string UPDATED_AT = null;

    /**
     * How long changes are kept for catching up; an older cursor takes a fresh snapshot instead.
     */
    public const int RETAINED_HOURS = 24;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'version' => 'integer',
            'mutation_type' => NotificationMutationType::class,
            'sequence' => 'integer',
            'created_at' => 'immutable_datetime',
        ];
    }

    /**
     * The change the scope's latest mutation made to the receipt, under the scope's lock.
     */
    public static function create(
        NotificationScope $scope,
        NotificationReceipt $receipt,
        NotificationMutationType $type,
    ): self {
        $change = new self([
            'scope_id' => $scope->id,
            'version' => $scope->mutation_version,
            'receipt_id' => $receipt->id,
            'mutation_type' => $type,
            'sequence' => $receipt->sequence,
        ]);

        $change->save();

        return $change;
    }

    // ----------[ Queries ]----------

    /**
     * The scope's changes after one version up to another, oldest first, at most the limit.
     *
     * @return list<self>
     */
    public static function between(string $scopeId, int $afterVersion, int $throughVersion, int $limit): array
    {
        return array_values(self::query()
            ->where('scope_id', $scopeId)
            ->where('version', '>', $afterVersion)
            ->where('version', '<=', $throughVersion)
            ->orderBy('version')
            ->readLimit($limit)
            ->get()
            ->all());
    }

    /**
     * The oldest version the scope still keeps a change of, when it keeps any.
     *
     * @return Option<int>
     */
    public static function oldestVersionOf(string $scopeId): Option
    {
        $version = self::query()->where('scope_id', $scopeId)->min('version');

        return Option::fromValue($version === null ? null : (int) $version);
    }
}
