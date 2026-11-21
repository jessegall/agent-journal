<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
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
 */
#[Table('inboxes')]
#[Fillable(['provider_key', 'provider_id'])]
final class InboxRecord extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    public static function create(string $providerKey, string $providerId): self
    {
        $inbox = new self([
            'provider_key' => $providerKey,
            'provider_id' => $providerId,
        ]);

        $inbox->save();

        return $inbox;
    }
}
