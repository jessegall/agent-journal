<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsRowSets;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use App\Support\AttentionOrigin;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A hook message or an ordered event contribution waiting to be handed over in an agent's next hook.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $origin_type
 * @property string $origin_id
 * @property list<string> $lines
 * @property bool $requests_attention
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['origin_type', 'origin_id', 'lines', 'requests_attention'])]
final class PendingAgentMessage extends Model implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use InsertsRowSets;
    use Linkable;

    /**
     * The most deliveries one hook hands over, with all their lines.
     */
    public const int DELIVERY_LIMIT = 50;

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return ['lines' => 'array', 'requests_attention' => 'boolean'];
    }

    /**
     * @param  list<string>  $lines
     */
    public static function create(
        ActorIdentity $agent,
        AttentionOrigin $origin,
        array $lines,
        bool $requestsAttention,
    ): self {
        $message = self::unsaved($agent, $origin, $lines, $requestsAttention);
        $message->save();

        return $message;
    }

    /**
     * The row of one message, not yet written, for createAll.
     *
     * @param  list<string>  $lines
     */
    public static function unsaved(
        ActorIdentity $agent,
        AttentionOrigin $origin,
        array $lines,
        bool $requestsAttention,
    ): self {
        $message = new self([
            'origin_type' => $origin->type,
            'origin_id' => $origin->id,
            'lines' => $lines,
            'requests_attention' => $requestsAttention,
        ]);

        $message->belongTo($agent);

        return $message;
    }

    // ----------[ Queries ]----------

    public static function countFor(ActorIdentity $agent): int
    {
        return self::query()->ownedBy($agent)->count();
    }

    public static function countAttentionFor(ActorIdentity $agent): int
    {
        return self::query()->ownedBy($agent)->where('requests_attention', true)->count();
    }
}
