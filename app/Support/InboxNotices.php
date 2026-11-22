<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\SendMessage\SendMessageCommand;
use App\Contracts\Actor;
use App\Contracts\ActorInboxResolver;
use App\Contracts\AgentCallContext;
use App\Contracts\CommandBus;
use App\Contracts\Inbox;
use App\Contracts\InboxNotices as InboxNoticesContract;
use App\Contracts\InboxResolver;
use App\Contracts\JournalAdmission;
use App\Enums\CommandEntry;
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
        private EntryDispatchers $entryDispatchers,
        private RequestKey $key,
        private AcceptedReceipt $accepted,
        private InboxResolver $inboxes,
        private ActorInboxResolver $destinations,
        private JournalAdmission $admission,
        private AgentCallContext $call,
    ) {}

    public function send(Inbox $source, Inbox $destination, string $body): string
    {
        return $this->commands->run(new SendMessageCommand($source->inboxId(), $destination->inboxId(), $body));
    }

    public function sendFromJournal(Actor|null $recipient, string $body, string $key): string
    {
        $source = $this->inboxes->named(self::SYSTEM_INBOX);
        $destination = $this->destinations->preferredFor($recipient ?? $this->admission->owner());
        $message = new SendMessageCommand($source->inboxId(), $destination->inboxId(), $body);

        return $this->call->within(None::create(), fn (): string => $this->accepted->independently(
            fn (): string => $this->key->independently(
                $key,
                fn (): string => $this->entryDispatchers->runAsJournal(
                    CommandEntry::Application,
                    self::SYSTEM_ENTRY,
                    $message,
                ),
            ),
        ));
    }
}
