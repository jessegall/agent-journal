<?php

declare(strict_types=1);

namespace App\Models\Sharing;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Enums\ShareAuditActor;
use App\Enums\ShareAuditType;
use App\Support\ActorIdentity;
use App\Support\ShareAuditEntry;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One appended fact about sharing: a step of a share's life, a public read allowed or denied, a gateway change or a
 * pruning, with who caused it and a reason code. It holds no content, secret or address and is never changed.
 *
 * @property string $id
 * @property string|null $share_id
 * @property ShareAuditType $type
 * @property ActorType $actor_type
 * @property string $actor_id
 * @property string|null $reason_code
 * @property CarbonImmutable $created_at
 */
#[Fillable(['type', 'actor_type', 'actor_id', 'reason_code'])]
final class ShareAudit extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'core.share-audit';

    public const null UPDATED_AT = null;

    /**
     * How long a public read's row is kept.
     */
    private const int READ_DAYS = 30;

    /**
     * How long a step of a share's life is kept after the share ended.
     */
    private const int LIFECYCLE_DAYS = 365;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ShareAuditType::class,
            'actor_type' => ActorType::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Appends a fact about one share, or, with no share, about the installation's sharing as a whole, such as a
     * gateway change.
     */
    public static function create(
        Share|null $share,
        ShareAuditType $type,
        ActorIdentity $actor,
        string|null $reasonCode,
    ): self {
        $audit = new self();
        $audit->type = $type;
        $audit->actor_type = $actor->type;
        $audit->actor_id = $actor->id;
        $audit->reason_code = $reasonCode;
        $audit->share_id = $share?->id;
        $audit->save();

        return $audit;
    }

    // ----------[ Accessors ]----------

    /**
     * The row as the share's owner reads it: a public read shows an unknown visitor, any other step its actor's role:
     * the
     * owner, the requesting agent or the system.
     *
     * @return Attribute<ShareAuditEntry, never>
     */
    protected function entry(): Attribute
    {
        return Attribute::get(
            fn () => new ShareAuditEntry(
                $this->id,
                $this->type,
                $this->created_at,
                $this->reason_code,
                $this->shownActor(),
            ),
        )->withoutObjectCaching();
    }

    // ----------[ Internals ]----------

    private function shownActor(): ShareAuditActor
    {
        if ($this->type->isRead()) {
            return ShareAuditActor::Visitor;
        }

        return match ($this->actor_type) {
            ActorType::User => ShareAuditActor::Owner,
            ActorType::Agent => ShareAuditActor::Agent,
            ActorType::System => ShareAuditActor::System,
        };
    }

    // ----------[ Queries ]----------

    /**
     * One page of the share's audit rows, newest first, starting after the given id; one more row than the page holds
     * is read so the caller knows whether another follows.
     *
     * @return list<self>
     */
    public static function pageOf(Share $share, string|null $after, int $rows): array
    {
        $query = self::query()->ofShare($share)->orderByDesc('id');
        $query->when($after, fn (Builder $query, string $id) => $query->olderThan($id));

        return array_values($query->readExactly($rows + 1)->get()->all());
    }

    /**
     * The audit rows past their retention, oldest first and locked, at most the given number: a public read after 30
     * days, a step of a share's life 365 days after the share ended. The installation's own rows are kept.
     *
     * @return list<self>
     */
    public static function lockPastRetention(CarbonImmutable $now, int $most): array
    {
        $reads = array_map(fn (ShareAuditType $type) => $type->value, ShareAuditType::readTypes());
        $endedLongAgo = Share::endedBefore($now->subDays(self::LIFECYCLE_DAYS));

        return array_values(self::query()
            ->whereNotNull('share_id')
            ->where(fn (Builder $query) => $query
                ->where(
                    fn (Builder $readEntries) => $readEntries->whereIn('type', $reads)->where(
                        'created_at',
                        '<',
                        $now->subDays(self::READ_DAYS),
                    ),
                )
                ->orWhere(
                    fn (Builder $lifecycle) => $lifecycle->whereNotIn('type', $reads)->whereIn(
                        'share_id',
                        $endedLongAgo,
                    ),
                ))
            ->orderBy('id')->lockForUpdate()->readExactly($most)->get()->all());
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofShare(Builder $query, Share $share): void
    {
        $query->where('share_id', $share->id);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function olderThan(Builder $query, string $id): void
    {
        $query->where('id', '<', $id);
    }
}
