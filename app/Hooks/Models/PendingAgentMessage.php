<?php

declare(strict_types=1);

namespace App\Hooks\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A state's message to an agent that went idle on the hook that sent it: it waits here for the agent's next hook,
 * which adds it to the agent's context and removes it.
 *
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $hook_id
 * @property string $text
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['hook_id', 'text'])]
final class PendingAgentMessage extends Model implements ReadableModel
{
    use BelongsToOneActor, BoundedReads, HasUlids;
    use Linkable;

    /**
     * The most messages one hook hands over; any further ones wait for the hook after it.
     */
    public const int LARGEST_DELIVERY = 50;

    public static function keep(ActorIdentity $agent, string $hookId, string $text): self
    {
        $message = new self(['hook_id' => $hookId, 'text' => $text]);
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

        return array_values($messages->map(fn (self $message) => $message->text)->all());
    }

    public static function countFor(ActorIdentity $agent): int
    {
        return self::query()->ownedBy($agent)->count();
    }
}
