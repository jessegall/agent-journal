<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsRowSets;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Support\RecordIdentity;
use App\Support\ShareSelectedTarget;
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
    use BoundedReads;
    use HasUlids;
    use InsertsRowSets;
    use Linkable;

    public const string LINK_TYPE = 'core.share-member';

    // ----------[ Constructors ]----------

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
    public static function create(Share $share, RecordIdentity $source, ShareSelectedTarget $target): self
    {
        $member = self::unsaved($share, $source, $target);
        $member->save();

        return $member;
    }

    /**
     * The row of one shared target, not yet written, for createAll.
     */
    public static function unsaved(Share $share, RecordIdentity $source, ShareSelectedTarget $target): self
    {
        $member = new self();
        $member->share_id = $share->id;
        $member->scope_version = $share->scope_version;
        $member->link_id = $target->linkId;
        $member->source_type = $source->type;
        $member->source_id = $source->id;
        $member->target_type = $target->record->type;
        $member->target_id = $target->record->id;

        return $member;
    }

    // ----------[ Queries ]----------

    /**
     * The members the share's current scope still approves.
     *
     * @return list<self>
     */
    public static function currentOf(Share $share): array
    {
        return array_values(
            self::query()
                ->ofScope($share)
                ->stillApproved()
                ->orderBy('id')
                ->readAll('a share scope holds at most the preview limit of members')
                ->get()
                ->all(),
        );
    }

    /**
     * The links the share's current scope still approves.
     *
     * @return list<string>
     */
    public static function approvedLinkIdsOf(Share $share): array
    {
        return array_values(
            array_map(
                strval(...),
                self::query()
                    ->ofScope($share)
                    ->stillApproved()
                    ->readAll('a share scope holds at most the preview limit of members')
                    ->pluck('link_id')
                    ->all(),
            ),
        );
    }

    /**
     * Whether a live, unexpired share approves the record in its current scope.
     */
    public static function isApprovedInLiveShare(RecordIdentity $record): bool
    {
        $members = self::query()->targeting($record)->stillApproved()->limit(Share::LIVE_LIMIT)->get(
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
        $linkIds = self::query()->ofScope($share)
            ->stillApproved()
            ->fromSource($source)
            ->targeting($target)
            ->limit(1)
            ->pluck('link_id')
            ->all();

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

        $members = self::query()
            ->ofScope($share)
            ->stillApproved()
            ->fromSource($source)
            ->readAll('a share scope holds at most the preview limit of members')
            ->get(['target_type', 'target_id']);

        foreach ($members as $member) {
            $grouped[$member->target_type][] = $member->target();
        }

        return $grouped;
    }

    // ----------[ Answers ]----------

    public function target(): RecordIdentity
    {
        return new RecordIdentity($this->target_type, $this->target_id);
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function onLinks(Builder $query, array $ids): void
    {
        $query->whereIn('link_id', $ids);
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
