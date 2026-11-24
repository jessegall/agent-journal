<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Chat\ActorDesks;
use App\Models\CommandRules\CommandReceipt;
use App\Models\Desks\DeskRecord;
use App\Models\Messages\Message;
use App\Support\AcceptedOperation;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\DeskService;
use App\Support\MessageBody;
use App\Support\MessageEnvelope;
use App\Support\ReceiptCaller;
use App\Support\ReceiptRetention;
use stdClass;

/**
 * Records inbox messages for tests the way an accepted send does: a source desk only the journal sends from, the
 * recipient's own seated inbox, and a command receipt for the operation.
 */
trait WritesInboxMessages
{
    /**
     * A question to the actor's own inbox, which the actor sees and nobody else does.
     */
    protected function askInboxOf(ActorIdentity $recipient, string $body): Message
    {
        return $this->askBetween($this->journalDesk(), $this->inboxOf($recipient), $body);
    }

    /**
     * The actor's own inbox, seated and preferred, made the first time it is asked for.
     */
    protected function inboxOf(ActorIdentity $actor): DeskRecord
    {
        return DeskRecord::preferredBy($actor)->getOrCall(fn () => DeskRecord::query()->findOrFail(
            $this->app->make(AssignmentTransaction::class)->run(
                fn () => $this->app->make(ActorDesks::class)->provision($actor, 'Own')->deskId,
            ),
        ));
    }

    /**
     * A question between two inboxes no actor is seated at, which no actor sees.
     */
    protected function askNobody(string $body): Message
    {
        $nobody = $this->app->make(DeskService::class)->openSourceDesk((string) str()->ulid(), 'Nobody');

        return $this->askBetween($this->journalDesk(), $nobody, $body);
    }

    private function askBetween(DeskRecord $source, DeskRecord $destination, string $body): Message
    {
        $author = ActorContext::forAgent(TestIds::of(99));
        $receipt = CommandReceipt::create(
            ReceiptCaller::withoutSession($author),
            (string) str()->ulid(),
            new stdClass(),
            ReceiptRetention::standard(),
        );
        $envelope = MessageEnvelope::ask($source, $destination, ActorIdentity::of($author), MessageBody::from($body));

        return Message::create($envelope, new AcceptedOperation($receipt->id));
    }

    private function journalDesk(): DeskRecord
    {
        return $this->app->make(DeskService::class)->openSourceDesk((string) str()->ulid(), 'Journal');
    }
}
