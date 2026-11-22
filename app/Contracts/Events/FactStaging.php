<?php

declare(strict_types=1);

namespace App\Contracts\Events;

/**
 * What a fact's release needs from the moment its command ran: captured while the command's admission is open, and
 * handed back when the fact is delivered after the commit.
 */
interface FactStaging
{
    /**
     * The context of the fact's delivery as the running command sees it, or none when the fact needs none.
     */
    public function stage(Event $event): object|null;

    /**
     * Delivers the committed fact once through Laravel's dispatcher, under the context staged for it.
     */
    public function deliver(Event $event, object|null $staged): void;
}
