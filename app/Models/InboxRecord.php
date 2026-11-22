<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\ReadableModel;
use App\Exceptions\InboxUnavailable;
use App\Support\ChatInboxes;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * An inbox's bare identity: the key of the provider that owns it and that provider's own id for it. The label
 * belongs to the provider.
 *
 * @property string $id
 * @property string $provider_key
 * @property string $provider_id
 * @property int $next_sequence
 */
#[Table('inboxes')]
#[Fillable(['provider_key', 'provider_id'])]
final class InboxRecord extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['next_sequence' => 'integer'];
    }

    public static function create(string $providerKey, string $providerId): self
    {
        $inbox = new self([
            'provider_key' => $providerKey,
            'provider_id' => $providerId,
        ]);

        $inbox->save();

        return $inbox;
    }

    // ----------[ Queries ]----------

    /**
     * Whether the inbox is a chat's, read only through its members' receipts.
     */
    public static function isChatInbox(string $id): bool
    {
        return self::query()->whereKey($id)->where('provider_key', ChatInboxes::PROVIDER_KEY)->exists();
    }

    // ----------[ Mutations ]----------

    /**
     * The inbox row locked for taking its next timeline position: the one allocator for chat messages and membership
     * events, so two writers on one inbox never get the same number.
     *
     * @throws InboxUnavailable
     */
    public static function lockedForSequence(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOr(fn () => throw InboxUnavailable::forId($id));
    }

    /**
     * Takes the inbox's next timeline position on this locked row.
     */
    public function takeSequence(): int
    {
        $this->next_sequence++;
        $this->save();

        return $this->next_sequence;
    }
}
