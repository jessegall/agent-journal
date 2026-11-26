<?php

declare(strict_types=1);

namespace Domain\Sharing\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Domain\Sharing\Enums\ShareAuditActor;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Support\ShareAuditEntry;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * @property string $id
 * @property string|null $share_id
 * @property ShareAuditType $type
 * @property string $actor_type
 * @property string $actor_id
 * @property string|null $reason_code
 * @property CarbonImmutable $created_at
 * @property-read mixed $entry
 *
 * @mixin \Eloquent
 */
final class ShareAudit extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;
    use OrdersById;

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
        ActorReference $actor,
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
     * the owner, the requesting agent or the system.
     *
     * @return Attribute<ShareAuditEntry, never>
     */
    protected function entry(): Attribute
    {
        return Accessor::get(fn () => new ShareAuditEntry(
            $this->id,
            $this->type,
            $this->created_at,
            $this->reason_code,
            $this->shownActor(),
        ));
    }

    // ----------[ Internals ]----------

    private function shownActor(): ShareAuditActor
    {
        if ($this->type->isRead()) {
            return ShareAuditActor::Visitor;
        }

        return ShareAuditActor::forStoredType($this->actor_type);
    }

    // ----------[ Queries ]----------

    /**
     * One page of the share's audit rows, newest first, starting after the given id; one more row than the page holds
     * is read so the caller knows whether another follows.
     *
     * @return list<self>
     */
    public static function findPageOf(Share $share, string|null $after, int $rows): array
    {
        $audits = self::query()->ofShare($share)->newestFirst()->olderThanWhenNamed($after)
            ->readExactly($rows + 1)
            ->get();

        return array_values($audits->all());
    }

    /**
     * The audit rows past their retention, oldest first and locked, at most the given number: a public read after 30
     * days, a step of a share's life 365 days after the share ended. The installation's own rows are kept.
     *
     * @return list<self>
     */
    public static function findLockedPastRetention(CarbonImmutable $now, int $most): array
    {
        $audits = self::query()->pastRetentionAt($now)->oldestFirst()->lockForUpdate()->readExactly($most)->get();

        return array_values($audits->all());
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

    /**
     * The rows older than that row; all of them with none.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function olderThanWhenNamed(Builder $query, string|null $after): void
    {
        $query->when($after, fn (Builder $older, string $id) => $older->olderThan($id));
    }

    /**
     * The share rows past their retention then: a public read after its days, a step of a share's life once the
     * share ended long enough ago.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pastRetentionAt(Builder $query, CarbonImmutable $now): void
    {
        $reads = array_map(fn (ShareAuditType $type) => $type->value, ShareAuditType::readTypes());
        $endedLongAgo = Share::query()->endedBefore($now->subDays(self::LIFECYCLE_DAYS));
        $readCutoff = $now->subDays(self::READ_DAYS);

        $query->whereNotNull('share_id')->where(fn (Builder $expired) => $expired
            ->where(fn (Builder $read) => $read->whereIn('type', $reads)->where('created_at', '<', $readCutoff))
            ->orWhere(fn (Builder $step) => $step->whereNotIn('type', $reads)->whereIn('share_id', $endedLongAgo)));
    }
}
