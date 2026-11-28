<?php

declare(strict_types=1);

namespace Domain\Reminders\Resolvers\Support;

use App\Access\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\CurrentActor;
use App\Agents\Enums\AccessType;
use App\Exceptions\ActorNotAllowed;
use Domain\Reminders\Models\Reminder;
use Domain\Reminders\Policies\ReminderPolicy;
use Domain\Reminders\Values\ReminderCard;
use Domain\Reminders\Values\ReminderPage;
use Illuminate\Database\Eloquent\Builder;

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
        $query = $this->ordered();
        $total = $query->clone()->count();
        $cards = $query->forPage($page, self::PER_PAGE)->get()->map(self::card(...));

        return new ReminderPage($cards->values()->all(), $page, self::PER_PAGE, $total);
    }

    /** @return list<ReminderCard> */
    public function preview(int $limit): array
    {
        return $this->ordered()
            ->limit($limit)
            ->get(['id', 'title', 'due_at', 'status'])
            ->map(self::card(...))
            ->values()
            ->all();
    }

    /** @return Builder<Reminder> */
    private function ordered(): Builder
    {
        $this->authorizer->authorize(ReminderPolicy::class, Reminder::class, AccessType::Read);

        return Reminder::query()->ownedBy($this->actors->actor())->inDueOrder();
    }

    private static function card(Reminder $reminder): ReminderCard
    {
        return new ReminderCard($reminder->id, $reminder->title, $reminder->due_at, $reminder->status);
    }
}
