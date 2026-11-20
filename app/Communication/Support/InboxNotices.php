<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\JournalAdmission;
use App\Agents\Contracts\AgentCallContext;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\AcceptedReceipt;
use App\Bus\Support\EntryDispatchers;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\SendMessage;
use App\Communication\Contracts\ActorInboxResolver;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxNotices as InboxNoticesContract;
use App\Communication\Contracts\InboxResolver;
use PhpOption\None;

/**
 * Sends a notice from one inbox to another through the one send path, under the caller's request key.
 */
final readonly class InboxNotices implements InboxNoticesContract
{
    public const string SYSTEM_ENTRY = 'inbox notice';

    public const string SYSTEM_INBOX = 'system';

    public function __construct(
        private CommandBus $commands,
        private EntryDispatchers $entries,
        private RequestKey $key,
        private AcceptedReceipt $accepted,
        private InboxResolver $inboxes,
        private ActorInboxResolver $destinations,
        private JournalAdmission $admission,
        private AgentCallContext $call,
    ) {}

    public function send(Inbox $source, Inbox $destination, string $body): string
    {
        return $this->commands->run(new SendMessage($source->inboxId(), $destination->inboxId(), $body));
    }

    public function sendFromJournal(Actor|null $recipient, string $body, string $key): string
    {
        $source = $this->inboxes->named(self::SYSTEM_INBOX);
        $destination = $this->destinations->preferredFor($recipient ?? $this->admission->owner());
        $message = new SendMessage($source->inboxId(), $destination->inboxId(), $body);

        return $this->call->within(None::create(), fn (): string => $this->accepted->independently(
            fn (): string => $this->key->independently(
                $key,
                fn (): string => $this->entries->runAsJournal(CommandEntry::Application, self::SYSTEM_ENTRY, $message),
            ),
        ));
    }
}
