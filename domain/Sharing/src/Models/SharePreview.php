<?php

declare(strict_types=1);

namespace Domain\Sharing\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToOneRoot;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Sharing\Events\SharePreviewConsumed;
use Domain\Sharing\Exceptions\SharePreviewRefused;
use Domain\Sharing\Support\ShareCandidates;
use Domain\Sharing\Support\ShareSelectedTarget;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\Option;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $owner_user_id
 * @property string $root_type
 * @property string $root_id
 * @property DataCollection<int, ShareSelectedTarget> $selection
 * @property string $share_gateway_configuration_id
 * @property int $configuration_version
 * @property string $checksum
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $consumed_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $root
 *
 * @mixin \Eloquent
 */
final class SharePreview extends Model implements EventSource, ReadableModel
{
    use BelongsToOneRoot;
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    public const int MINUTES_VALID = 10;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'selection' => DataCollection::class.':'.ShareSelectedTarget::class,
            'configuration_version' => 'integer',
            'expires_at' => 'immutable_datetime',
            'consumed_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The owner's preview of a root with the selected linked records, valid for ten minutes from now.
     *
     * @param  list<ShareSelectedTarget>  $selection
     */
    public static function create(
        string $ownerUserId,
        RecordIdentity $root,
        array $selection,
        ShareGatewayConfiguration $configuration,
    ): self {
        $preview = new self();
        $preview->owner_user_id = $ownerUserId;
        $preview->root_type = $root->type;
        $preview->root_id = $root->id;
        $preview->selection = ShareSelectedTarget::collect($selection, DataCollection::class);
        $preview->share_gateway_configuration_id = $configuration->id;
        $preview->configuration_version = $configuration->configuration_version;
        $preview->checksum = self::checksumOf($ownerUserId, $root, $selection, $configuration);
        $preview->expires_at = CarbonImmutable::now()->addMinutes(self::MINUTES_VALID);
        $preview->save();

        return $preview;
    }

    // ----------[ Mutations ]----------

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
        $this->assertConsumableBy($ownerUserId);

        $records = array_map(fn (ShareSelectedTarget $target) => $target->record->id, $this->selection->items());
        $selection = $current->selection($records);

        $this->assertUnchanged($ownerUserId, $checksum, $selection);

        $this->consumed_at = CarbonImmutable::now();
        $this->assertSaved($this->save());
        $this->raise(new SharePreviewConsumed($this->id));

        return $selection;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<RecordIdentity, never>
     */
    protected function root(): Attribute
    {
        return Accessor::get(fn () => new RecordIdentity($this->root_type, $this->root_id));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a preview of another owner, one already used, and one that expired.
     *
     * @throws SharePreviewRefused
     */
    private function assertConsumableBy(string $ownerUserId): void
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
    }

    /**
     * Refuses a preview whose checksum the caller or the records it shows no longer match.
     *
     * @param  list<ShareSelectedTarget>  $selection
     *
     * @throws SharePreviewRefused
     */
    private function assertUnchanged(string $ownerUserId, string $checksum, array $selection): void
    {
        $configuration = ShareGatewayConfiguration::query()->findOrFail($this->share_gateway_configuration_id);

        if ($checksum !== $this->checksum
            || self::checksumOf($ownerUserId, $this->root, $selection, $configuration) !== $this->checksum) {
            throw SharePreviewRefused::changed($this->id);
        }
    }

    // ----------[ Internals ]----------

    /**
     * @param  list<ShareSelectedTarget>  $selection
     */
    private static function checksumOf(
        string $ownerUserId,
        RecordIdentity $root,
        array $selection,
        ShareGatewayConfiguration $configuration,
    ): string {
        $targets = array_map(
            fn (ShareSelectedTarget $target) => [
                $target->record->type,
                $target->record->id,
                $target->linkId,
                $target->publicationVersion,
            ],
            $selection,
        );

        return hash(
            'sha256',
            json_encode(
                [
                    $ownerUserId,
                    $root->type,
                    $root->id,
                    $targets,
                    $configuration->id,
                    $configuration->configuration_version,
                ],
                JSON_THROW_ON_ERROR,
            ),
        );
    }

    // ----------[ Queries ]----------

    /**
     * The preview of this id, read without a lock to learn which configuration to lock first.
     *
     * @throws SharePreviewRefused
     */
    public static function findOf(string $previewId): self
    {
        return self::query()->whereKey($previewId)->firstOr(SharePreviewRefused::throwing()->unknown($previewId));
    }

    /**
     * The preview of this id, locked until the transaction ends so it is consumed once.
     *
     * @throws SharePreviewRefused
     */
    public static function findLockedFor(string $previewId): self
    {
        return self::query()
            ->whereKey($previewId)
            ->lockForUpdate()
            ->firstOr(SharePreviewRefused::throwing()->unknown($previewId));
    }

    /**
     * The owner's newest preview of the root that is neither used nor expired, if there is one.
     *
     * @return Option<self>
     */
    public static function findOpenFor(string $ownerUserId, RecordIdentity $root): Option
    {
        $sharePreview = self::query()->ownedBy($ownerUserId)->ofRoot($root)->stillOpen()->newestFirst()->first();

        return Option::fromValue(
            $sharePreview,
        );
    }

    // ----------[ Scopes ]----------

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
    protected function stillOpen(Builder $query): void
    {
        $query->whereNull('consumed_at')->where('expires_at', '>', CarbonImmutable::now());
    }
}
