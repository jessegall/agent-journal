<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsRowSets;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use App\Support\AttentionOrigin;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $origin_type
 * @property string $origin_id
 * @property array $lines
 * @property bool $requests_attention
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Fillable([
    'origin_type',
    'origin_id',
    'lines',
    'requests_attention',
])]
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

    protected function casts(): array
    {
        return [
            'lines' => 'array',
            'requests_attention' => 'boolean',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Keeps a message for the agent for each text, each asking for its attention, in one insert.
     *
     * @param  list<string>  $texts
     * @return list<string> the ids of the rows written
     */
    public static function createMany(ActorIdentity $agent, AttentionOrigin $origin, array $texts): array
    {
        $messages = [];

        foreach ($texts as $text) {
            $message = new self([
                'origin_type' => $origin->type,
                'origin_id' => $origin->id,
                'lines' => [$text],
                'requests_attention' => true,
            ]);
            $message->belongTo($agent);
            $messages[] = $message;
        }

        return self::insertRows($messages);
    }

    // ----------[ Queries ]----------

    public static function countFor(ActorIdentity $agent): int
    {
        return self::query()->ownedBy($agent)->count();
    }

    public static function countAttentionFor(ActorIdentity $agent): int
    {
        return self::query()->ownedBy($agent)->askingAttention()->count();
    }

    // ----------[ Scopes ]----------

    /**
     * The messages that ask for the agent's attention.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function askingAttention(Builder $query): void
    {
        $query->where('requests_attention', true);
    }
}
