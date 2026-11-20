<?php

declare(strict_types=1);

namespace App\Agents\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/** The immutable message source captured when a child session opened. */
#[Fillable(['session_id', 'message_id', 'captured_at'])]
final class JobMessageSource extends Model
{
    protected $table = 'chat_job_sources';

    protected $primaryKey = 'session_id';

    protected $keyType = 'string';

    public $incrementing = false;

    public $timestamps = false;

    public static function capture(string $sessionId, string $messageId): void
    {
        self::query()->firstOrCreate(['session_id' => $sessionId], [
            'message_id' => $messageId,
            'captured_at' => CarbonImmutable::now(),
        ]);
    }

    public static function messageFor(string $sessionId): string|null
    {
        return self::query()->whereKey($sessionId)->value('message_id');
    }

    /** @return Builder<self> */
    public static function messagesFor(string $sessionId): Builder
    {
        return self::query()->whereKey($sessionId)->select('message_id');
    }
}
