<?php

declare(strict_types=1);

namespace App\Hooks\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\AttentionOrigin;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
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
    use BelongsToOneActor, BoundedReads, HasUlids;
    use Linkable;

    /**
     * The most deliveries one hook hands over, with all their lines.
     */
    public const int LARGEST_DELIVERY = 50;

    protected function casts(): array
    {
        return ['lines' => 'array', 'requests_attention' => 'boolean'];
    }

    /**
     * @param  list<string>  $lines
     */
    public static function keep(
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
        $message->save();

        return $message;
    }

    /**
     * The texts waiting for the agent, oldest first, removed as they are handed over.
     *
     * @return list<string>
     */
    public static function takeAllFor(ActorIdentity $agent): array
    {
        $messages = self::query()
            ->ownedBy($agent)
            ->orderBy('created_at')
            ->orderBy('id')
            ->lockForUpdate()
            ->readLimit(self::LARGEST_DELIVERY)
            ->get();
        self::query()->ownedBy($agent)->whereKey($messages->modelKeys())->delete();

        return $messages->flatMap(fn (self $message) => $message->lines)->values()->all();
    }

    public static function countFor(ActorIdentity $agent): int
    {
        return self::query()->ownedBy($agent)->count();
    }

    public static function countAttentionFor(ActorIdentity $agent): int
    {
        return self::query()->ownedBy($agent)->where('requests_attention', true)->count();
    }
}
