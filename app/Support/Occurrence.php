<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Event;

/**
 * One fact in an event unit: the event, the chain of facts whose required listeners raised it, and the delivery
 * context staged for it while its command ran.
 */
final readonly class Occurrence
{
    /**
     * @param  list<string>  $chain
     */
    public function __construct(public Event $event, public array $chain, public object|null $staged) {}

    /**
     * Its chain with itself at the end, as the facts its required listeners raise carry it.
     *
     * @return list<string>
     */
    public function chainWithItself(): array
    {
        return [...$this->chain, $this->event::class];
    }
}
