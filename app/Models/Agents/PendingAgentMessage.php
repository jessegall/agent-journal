<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Actors\AttentionOrigin;
use App\Concerns\BoundedReads;
use App\Concerns\InsertsRowSets;
use App\Concerns\Linkable;
use App\Models\Support\BelongsToOneActor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $origin_type
 * @property string $origin_id
 * @property list<string> $lines
 * @property bool $requests_attention
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class PendingAgentMessage extends JournalModel implements ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use InsertsRowSets;
    use Linkable;

    /**
     * The most deliveries one hook hands over, with all their lines.
     */
    public const int DELIVERY_LIMIT = 50;

    /**
     * @return array<string, string>
     *
     * @column lines list<string>
     */
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
    public static function createMany(ActorReference $agent, AttentionOrigin $origin, array $texts): array
    {
        $messages = [];

        foreach ($texts as $text) {
            $message = new self();
            $message->origin_type = $origin->type;
            $message->origin_id = $origin->id;
            $message->lines = [$text];
            $message->requests_attention = true;
            $message->belongTo($agent);
            $messages[] = $message;
        }

        return self::insertRows($messages);
    }

    // ----------[ Queries ]----------

    public static function countFor(ActorReference $agent): int
    {
        return self::query()->ownedBy($agent)->count();
    }

    public static function countAttentionFor(ActorReference $agent): int
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

    /**
     * The rows by created at, then id.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byCreatedAt(Builder $query): void
    {
        $query->orderBy('created_at');
        $query->orderBy('id');
    }
}
