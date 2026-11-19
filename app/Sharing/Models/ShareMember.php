<?php

declare(strict_types=1);

namespace App\Sharing\Models;

use App\Links\Models\Link;
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
        $member = new self();
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
     * The members the share's current scope still approves.
     *
     * @return list<self>
     */
    public static function currentOf(Share $share): array
    {
        return array_values(
            self::query()->ofScope($share)->stillApproved()->orderBy('id')->readAll('a share scope holds at most the preview limit of members')->get()->all(),
        );
    }

    /**
     * Removes every member of the share, of every scope version, before a refreshed scope replaces them.
     */
    public static function forgetAllOf(Share $share): void
    {
        self::query()->ofShare($share)->delete();
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
        return array_values(
            array_map(strval(...), self::query()->ofScope($share)->stillApproved()->readAll('a share scope holds at most the preview limit of members')->pluck('link_id')->all()),
        );
    }

    /**
     * Whether a live, unexpired share approves the record in its current scope.
     */
    public static function isApprovedInLiveShare(RecordIdentity $record): bool
    {
        $members = self::query()->targeting($record)->stillApproved()->readLimit(Share::MOST_LIVE)->get(
            ['share_id', 'scope_version'],
        );
        $scopeOfShare = Share::liveScopeVersions(array_values(array_unique($members->pluck('share_id')->all())));

        return $members->contains(
            fn (self $member) => ($scopeOfShare[$member->share_id] ?? null) === $member->scope_version,
        );
    }

    /**
     * Whether the share's current scope approves the target linked from the source, over a link that still exists.
     */
    public static function approvesOverLiveLink(Share $share, RecordIdentity $source, RecordIdentity $target): bool
    {
        $linkIds = self::query()->ofScope($share)->stillApproved()->fromSource($source)->targeting($target)->readLimit(1)->pluck('link_id')->all();

        return $linkIds !== [] && Link::query()->whereKey($linkIds)->exists();
    }

    /**
     * The targets the share's current scope approves from the source, grouped by their link alias.
     *
     * @return array<string, list<RecordIdentity>>
     */
    public static function approvedTargetsFrom(Share $share, RecordIdentity $source): array
    {
        $grouped = [];

        foreach (self::query()->ofScope($share)->stillApproved()->fromSource($source)->readAll('a share scope holds at most the preview limit of members')->get(['target_type', 'target_id']) as $member) {
            $grouped[$member->target_type][] = $member->target();
        }

        return $grouped;
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
    protected function fromSource(Builder $query, RecordIdentity $source): void
    {
        $query->where('source_type', $source->type)->where('source_id', $source->id);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function targeting(Builder $query, RecordIdentity $record): void
    {
        $query->where('target_type', $record->type)->where('target_id', $record->id);
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
    protected function ofShare(Builder $query, Share $share): void
    {
        $query->where('share_id', $share->id);
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
