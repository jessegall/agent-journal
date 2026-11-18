<?php

declare(strict_types=1);

namespace App\Sharing\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use App\Sharing\Casts\SelectedTargetsCast;
use App\Sharing\Exceptions\SharePreviewRefused;
use App\Sharing\Support\ShareCandidates;
use App\Sharing\Support\ShareSelectedTarget;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\Option;

/**
 * What the owner saw and selected before sharing a root: the linked records with their links and publication
 * versions, under one gateway configuration version, sealed by a checksum over all of it. It lasts ten minutes and is
 * consumed once.
 *
 * @property string $id
 * @property string $owner_user_id
 * @property string $root_type
 * @property string $root_id
 * @property list<ShareSelectedTarget> $selection
 * @property string $share_gateway_configuration_id
 * @property int $configuration_version
 * @property string $checksum
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $consumed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['owner_user_id', 'root_type', 'root_id', 'selection', 'configuration_version', 'checksum', 'expires_at', 'consumed_at'])]
final class SharePreview extends Model implements ReadableModel
{
    use BoundedReads, HasUlids, Linkable;

    public const string LINK_TYPE = 'core.share-preview';

    public const int MINUTES_VALID = 10;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'selection' => SelectedTargetsCast::class,
            'configuration_version' => 'integer',
            'expires_at' => 'immutable_datetime',
            'consumed_at' => 'immutable_datetime',
        ];
    }

    /**
     * The owner's preview of a root with the selected linked records, valid for ten minutes from now.
     *
     * @param  list<ShareSelectedTarget>  $selection
     */
    public static function createFor(string $ownerUserId, RecordIdentity $root, array $selection, ShareGatewayConfiguration $configuration): self
    {
        $preview = new self;
        $preview->owner_user_id = $ownerUserId;
        $preview->root_type = $root->type;
        $preview->root_id = $root->id;
        $preview->selection = $selection;
        $preview->share_gateway_configuration_id = $configuration->id;
        $preview->configuration_version = $configuration->configuration_version;
        $preview->checksum = self::checksumOf($ownerUserId, $root, $selection, $configuration);
        $preview->expires_at = CarbonImmutable::now()->addMinutes(self::MINUTES_VALID);
        $preview->save();

        return $preview;
    }

    /**
     * The owner's newest preview of the root that is neither used nor expired, if there is one.
     *
     * @return Option<self>
     */
    public static function openFor(string $ownerUserId, RecordIdentity $root): Option
    {
        return Option::fromValue(self::query()->ownedBy($ownerUserId)->ofRoot($root)->stillOpen()->orderByDesc('id')->first());
    }

    public function root(): RecordIdentity
    {
        return new RecordIdentity($this->root_type, $this->root_id);
    }

    /**
     * Uses the preview once for its owner, after checking it still shows what the owner confirmed: the same selected
     * links and publication versions among the current candidates, under the same configuration version.
     *
     * @return list<ShareSelectedTarget>
     *
     * @throws SharePreviewRefused
     */
    public function consumeFor(string $ownerUserId, string $checksum, ShareCandidates $current): array
    {
        if ($this->owner_user_id !== $ownerUserId) {
            throw SharePreviewRefused::foreign($this->id);
        }

        if ($this->consumed_at !== null) {
            throw SharePreviewRefused::consumed($this->id);
        }

        if (! $this->expires_at->isFuture()) {
            throw SharePreviewRefused::expired($this->id);
        }

        $selection = $current->selection(array_map(fn (ShareSelectedTarget $target) => $target->record->id, $this->selection));
        $configuration = ShareGatewayConfiguration::query()->findOrFail($this->share_gateway_configuration_id);

        if ($checksum !== $this->checksum || self::checksumOf($ownerUserId, $this->root(), $selection, $configuration) !== $this->checksum) {
            throw SharePreviewRefused::changed($this->id);
        }

        $this->consumed_at = CarbonImmutable::now();
        $this->save();

        return $selection;
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ownedBy(Builder $query, string $ownerUserId): void
    {
        $query->where('owner_user_id', $ownerUserId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRoot(Builder $query, RecordIdentity $root): void
    {
        $query->where('root_type', $root->type)->where('root_id', $root->id);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function stillOpen(Builder $query): void
    {
        $query->whereNull('consumed_at')->where('expires_at', '>', CarbonImmutable::now());
    }

    /**
     * @param  list<ShareSelectedTarget>  $selection
     */
    private static function checksumOf(string $ownerUserId, RecordIdentity $root, array $selection, ShareGatewayConfiguration $configuration): string
    {
        $targets = array_map(fn (ShareSelectedTarget $target) => [$target->record->type, $target->record->id, $target->linkId, $target->publicationVersion], $selection);

        return hash('sha256', json_encode([$ownerUserId, $root->type, $root->id, $targets, $configuration->id, $configuration->configuration_version], JSON_THROW_ON_ERROR));
    }
}
