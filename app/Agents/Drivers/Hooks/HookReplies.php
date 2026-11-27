<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Hooks;

use App\Agents\Drivers\Contracts\DriverAdapter;
use App\Agents\Values\PlanFile;
use App\Hooks\Enums\CallFailure;
use App\Hooks\Enums\HookEvent;
use App\Sessions\Enums\OfflineReplyMode;
use Closure;
use Illuminate\Support\Str;

/**
 * The sealed reply file a start's hook answers from when the journal cannot answer in its budget: the
 * driver's events, its tool events and the tools that start its own child, and the reply to each event
 * for each reason, sealed with a key made for that start alone and written beside it.
 */
final readonly class HookReplies
{
    public const string REPLY_FILE = 'hook-replies.json';

    public const string KEY_FILE = 'hook-replies.key';

    private const int KEY_LENGTH = 64;

    /**
     * The longest a hook call waits for the journal, its one retry included, before it answers from the file.
     */
    private const int WAIT_MILLISECONDS_LIMIT = 5000;

    private const int RETRIES = 1;

    public function __construct(private OutageReply $replies) {}

    /**
     * The reply file and its key, as two files of the start's plan; while the journal is away the file answers as the
     * start's offline reply mode says.
     *
     * @param  class-string<DriverAdapter>  $adapter
     * @return list<PlanFile>
     */
    public function filesFor(string $adapter, OfflineReplyMode $offlineReply): array
    {
        $key = Str::random(self::KEY_LENGTH);
        $body = json_encode($this->bodyOf($adapter, $offlineReply), JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);

        $sealed = [
            'body' => $body,
            'seal' => self::sealOf($body, $key),
        ];

        return [
            new PlanFile(self::REPLY_FILE, json_encode($sealed, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)),
            PlanFile::programOnly(self::KEY_FILE, $key),
        ];
    }

    /**
     * The seal of the body under the key, as the hook checks it: the hex HMAC-SHA256 of the body's bytes.
     */
    public static function sealOf(string $body, string $key): string
    {
        return hash_hmac('sha256', $body, $key);
    }

    /**
     * @param  class-string<DriverAdapter>  $adapter
     * @return array<string, mixed>
     */
    private function bodyOf(string $adapter, OfflineReplyMode $offlineReply): array
    {
        $events = $adapter::nativeEvents();
        $toolEvents = array_intersect($events, [HookEvent::PreToolUse->value, HookEvent::PostToolUse->value]);

        return [
            'driver' => $adapter::hookProtocol(),
            'events' => $events,
            'toolEvents' => array_values($toolEvents),
            'spawnTools' => $adapter::nativeChildTools(),
            'budgetMs' => self::WAIT_MILLISECONDS_LIMIT,
            'retries' => self::RETRIES,
            'unknownEvent' => $this->replies->unknownEvent(),
            'replies' => [
                'away' => $this->eachOf($events, fn (string $event) => $this->replies->for(
                    CallFailure::Unreachable,
                    $offlineReply->passesOutages(),
                    $event,
                )),
                'unprepared' => $this->eachOf($events, $this->replies->preparationPending(...)),
                'spawn' => $this->eachOf($events, $this->replies->ownChildRefusal(...)),
            ],
        ];
    }

    /**
     * @param  list<string>  $events
     * @param  Closure(string): DriverReply  $reply
     * @return array<string, DriverReply>
     */
    private function eachOf(array $events, Closure $reply): array
    {
        return array_combine($events, array_map($reply, $events));
    }
}
