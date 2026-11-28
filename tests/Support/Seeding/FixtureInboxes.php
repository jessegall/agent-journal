<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Actors\ActorProvisioning;
use App\Inboxes\InboxReceiver;
use App\Messages\Contracts\MessageSender;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Foundation\Application;

/**
 * The inboxes a test arranges, stored as the journal stores them: an actor's personal inbox, an inbox two actors
 * share and a message under an inbox's next number.
 */
final readonly class FixtureInboxes
{
    public function __construct(private Application $app) {}

    /**
     * The actor's own inbox, made and joined the first time it is asked for.
     */
    public function personal(ActorReference $actor): Inbox
    {
        $inbox = Inbox::query()->personalTo($actor)->first();

        if ($inbox !== null) {
            return $inbox;
        }

        $this->app->make(ActorProvisioning::class)->provision($actor, 'Own');

        return Inbox::findPersonalOf($actor);
    }

    /**
     * An inbox of the provider the two actors share, both attached, with the personal inbox of each made too.
     */
    public function shared(ActorReference $first, ActorReference $second, string $provider = Inbox::NAMED_PROVIDER): Inbox
    {
        $this->personal($first);
        $this->personal($second);
        $inbox = Inbox::create($provider, self::pairKey($first, $second), 'Shared');
        $now = CarbonImmutable::now();
        InboxMember::create($inbox->id, $first, $now);
        InboxMember::create($inbox->id, $second, $now);

        return $inbox;
    }

    /**
     * A message the sender posts to the inbox, under the inbox's next number taken under the inbox's lock.
     */
    public function post(Inbox $inbox, MessageSender $sender, string $body): Message
    {
        $locked = Inbox::findLockedById($inbox->id);
        $number = $locked->takeMessageNumber();

        return Message::create(new InboxReceiver($locked), $number, ActorReference::of($sender), $body);
    }

    /**
     * The two actors in the order a shared inbox keys them, whichever comes first.
     */
    public static function pairKey(ActorReference $first, ActorReference $second): string
    {
        $members = [$first->text(), $second->text()];
        sort($members);

        return implode('|', $members);
    }
}
