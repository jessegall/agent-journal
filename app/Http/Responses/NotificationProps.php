<?php

declare(strict_types=1);

namespace App\Http\Responses;

use App\Contracts\Actors\CurrentActor;
use App\Exceptions\NotificationCursorInvalid;
use App\Resolvers\Support\NotificationChanges;
use App\Resolvers\Support\NotificationFeed;
use App\Support\ActorReference;
use Illuminate\Http\Request;
use Inertia\ResponseFactory;

/**
 * The shell's notification props, read only when a partial reload asks for them: the newest page or an older one by
 * its cursor, and the changes since a cursor. The bell reads them with router.reload({ only: [...] }).
 */
final readonly class NotificationProps
{
    /**
     * The query parameter that names the older page a reload of the notifications asks for.
     */
    public const string CURSOR = 'notificationsCursor';

    /**
     * The query parameter that names the cursor a reload of the notification changes reads from.
     */
    public const string SINCE = 'notificationsSince';

    public function __construct(
        private NotificationFeed $feed,
        private NotificationChanges $changes,
        private CurrentActor $actors,
        private ResponseFactory $inertia,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function of(Request $request): array
    {
        return [
            'notifications' => $this->inertia->optional(
                fn () => $this->feed->page($this->actor(), $this->cursorIn($request, self::CURSOR)),
            ),
            'notificationChanges' => $this->inertia->optional(
                fn () => $this->changes->since($this->actor(), $this->sinceIn($request)),
            ),
        ];
    }

    private function actor(): ActorReference
    {
        return $this->actors->actor();
    }

    /**
     * The cursor a reload of the changes reads from; a reload that names none is refused as an invalid cursor.
     */
    private function sinceIn(Request $request): string
    {
        $since = $this->cursorIn($request, self::SINCE);

        if ($since === null) {
            throw NotificationCursorInvalid::create();
        }

        return $since;
    }

    /**
     * The cursor a reload names, or none when it names no cursor.
     */
    private function cursorIn(Request $request, string $parameter): string|null
    {
        $cursor = $request->string($parameter)->toString();

        if ($cursor === '') {
            return null;
        }

        return $cursor;
    }
}
