<?php

declare(strict_types=1);

namespace App\Sharing\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Sharing\Enums\ShareAuditActor;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Support\ShareAuditEntry;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
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
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.share-audit';

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ShareAuditType::class,
            'actor_type' => ActorType::class,
            'created_at' => 'immutable_datetime',
        ];
    }

    /**
     * Appends a fact about one share.
     */
    public static function recordFor(Share $share, ShareAuditType $type, ActorIdentity $actor, string|null $reasonCode): self
    {
        $audit = self::fact($type, $actor, $reasonCode);
        $audit->share_id = $share->id;
        $audit->save();

        return $audit;
    }

    /**
     * Appends a fact about the installation's sharing as a whole, such as a gateway change.
     */
    public static function recordForInstallation(ShareAuditType $type, ActorIdentity $actor, string|null $reasonCode): self
    {
        $audit = self::fact($type, $actor, $reasonCode);
        $audit->save();

        return $audit;
    }

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

        return array_values($query->readLimit($rows + 1)->get()->all());
    }

    /**
     * The row as the share's owner reads it: a public read shows an unknown visitor, any other step its actor's role: the
     * owner, the requesting agent or the system.
     */
    public function entry(): ShareAuditEntry
    {
        return new ShareAuditEntry($this->id, $this->type, $this->created_at, $this->reason_code, $this->shownActor());
    }

    private function shownActor(): ShareAuditActor
    {
        if ($this->type->isRead()) {
            return ShareAuditActor::Visitor;
        }

        return match ($this->actor_type) {
            ActorType::User => ShareAuditActor::Owner,
            ActorType::Agent => ShareAuditActor::Agent,
            ActorType::System, ActorType::Engine => ShareAuditActor::System,
        };
    }

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

    private static function fact(ShareAuditType $type, ActorIdentity $actor, string|null $reasonCode): self
    {
        $audit = new self();
        $audit->type = $type;
        $audit->actor_type = $actor->type;
        $audit->actor_id = $actor->id;
        $audit->reason_code = $reasonCode;

        return $audit;
    }
}
