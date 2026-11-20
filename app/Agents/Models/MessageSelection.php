<?php

declare(strict_types=1);

namespace App\Agents\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/** The message currently selected for a session's request. */
#[Fillable(['session_id', 'message_id', 'selected_at'])]
final class MessageSelection extends Model
{
    protected $table = 'chat_selections';

    protected $primaryKey = 'session_id';

    protected $keyType = 'string';

    public $incrementing = false;

    public $timestamps = false;

    public static function select(string $sessionId, string $messageId): void
    {
        self::query()->updateOrCreate(['session_id' => $sessionId], [
            'message_id' => $messageId,
            'selected_at' => CarbonImmutable::now(),
        ]);
    }

    public static function messageFor(string $sessionId): string|null
    {
        return self::query()->whereKey($sessionId)->value('message_id');
    }
}
