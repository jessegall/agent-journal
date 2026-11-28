<?php

declare(strict_types=1);

namespace App\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorInboxResolver;
use App\Assignments\Contracts\Assignee;
use App\Inboxes\Contracts\LabeledInbox;
use App\Records\Contracts\Destinations;
use Closure;

final readonly class RecipientDestinations implements Destinations
{
    /**
     * @param Closure(): LabeledInbox $readInbox
     */
    private function __construct(private Assignee $holder, private Closure $readInbox) {}

    public static function direct(Assignee $holder, Actor $actor, ActorInboxResolver $inboxes): self
    {
        return new self($holder, fn () => $inboxes->preferredFor($actor));
    }

    public static function resolved(Assignee $holder, LabeledInbox $inbox): self
    {
        return new self($holder, fn () => $inbox);
    }

    public function assignee(): Assignee
    {
        return $this->holder;
    }

    public function inbox(): LabeledInbox
    {
        return ($this->readInbox)();
    }
}
