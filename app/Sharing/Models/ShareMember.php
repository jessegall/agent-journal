<?php

declare(strict_types=1);

namespace App\Sharing\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use App\Sharing\Support\ShareSelectedTarget;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One linked record the owner approved for a share at one scope version, with the exact link it was reached by. It
 * stops counting once invalidated, and a removed link never comes back by itself.
 *
 * @property string $id
 * @property string $share_id
 * @property int $scope_version
 * @property string $link_id
 * @property string $source_type
 * @property string $source_id
 * @property string $target_type
 * @property string $target_id
 * @property CarbonImmutable|null $invalidated_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['scope_version', 'link_id', 'source_type', 'source_id', 'target_type', 'target_id', 'invalidated_at'])]
final class ShareMember extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.share-member';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scope_version' => 'integer',
            'invalidated_at' => 'immutable_datetime',
        ];
    }

    /**
     * Approves the selected target, linked from the source, at the share's current scope version.
     */
    public static function approve(Share $share, RecordIdentity $source, ShareSelectedTarget $target): self
    {
        $member = new self;
        $member->share_id = $share->id;
        $member->scope_version = $share->scope_version;
        $member->link_id = $target->linkId;
        $member->source_type = $source->type;
        $member->source_id = $source->id;
        $member->target_type = $target->record->type;
        $member->target_id = $target->record->id;
        $member->save();

        return $member;
    }

    /**
     * Ends the approval of every member that rested on one of these links; a link made again has a new id, so only a
     * refreshed scope approves it.
     *
     * @param  list<string>  $linkIds
     */
    public static function invalidateForLinks(array $linkIds, CarbonImmutable $at): void
    {
        self::query()->onLinks($linkIds)->stillApproved()->update(['invalidated_at' => $at]);
    }

    /**
     * The links the share's current scope still approves.
     *
     * @return list<string>
     */
    public static function approvedLinkIdsOf(Share $share): array
    {
        return array_values(array_map(strval(...), self::query()->ofScope($share)->stillApproved()->readAll('a share scope holds at most the preview limit of members')->pluck('link_id')->all()));
    }

    public function target(): RecordIdentity
    {
        return new RecordIdentity($this->target_type, $this->target_id);
    }

    /**
     * @param  Builder<self>  $query
     * @param  list<string>  $linkIds
     */
    #[Scope]
    protected function onLinks(Builder $query, array $linkIds): void
    {
        $query->whereIn('link_id', $linkIds);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function stillApproved(Builder $query): void
    {
        $query->whereNull('invalidated_at');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofScope(Builder $query, Share $share): void
    {
        $query->where('share_id', $share->id)->where('scope_version', $share->scope_version);
    }
}
