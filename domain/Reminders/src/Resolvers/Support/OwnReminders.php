<?php

declare(strict_types=1);

namespace Domain\Reminders\Resolvers\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Enums\AccessType;
use App\Exceptions\ActorNotAllowed;
use App\Support\ActorIdentity;
use Domain\Reminders\Models\Reminder;
use Domain\Reminders\Policies\ReminderPolicy;
use Domain\Reminders\Values\ReminderCard;
use Domain\Reminders\Values\ReminderPage;

/**
 * Reads one page of the calling actor's own reminders, 25 to a page, open ones first by due time, once the actor may
 * read reminders at all; nobody reads another actor's.
 */
final readonly class OwnReminders
{
    public const int PER_PAGE = 25;

    public function __construct(private CurrentActor $actors, private CurrentAuthorizer $authorizer) {}

    /**
     * @throws ActorNotAllowed
     */
    public function own(int $page): ReminderPage
    {
        $this->authorizer->authorize(ReminderPolicy::class, Reminder::class, AccessType::Read);

        $query = Reminder::query()->ownedBy(ActorIdentity::of($this->actors->actor()));
        $total = $query->clone()->count();

        $cards = $query->inDueOrder()->forPage($page, self::PER_PAGE)->limit(self::PER_PAGE)->get()->map(
            fn (Reminder $reminder) => new ReminderCard(
                $reminder->id,
                $reminder->title,
                $reminder->due_at,
                $reminder->status,
            ),
        )->all();

        return new ReminderPage(array_values($cards), $page, self::PER_PAGE, $total);
    }
}
