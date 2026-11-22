<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\Events\Event;

/**
 * A checked subscription to one concrete application event.
 */
final readonly class StateEventDeclaration
{
    /**
     * @param  class-string<Event>  $event
     */
    public function __construct(
        public string $event,
        public StateMethod $method,
        public string $owner,
    ) {}

    public function cacheEntry(): string
    {
        return implode('|', [
            $this->event,
            $this->method->stateClass,
            $this->method->declaringClass,
            $this->method->name,
            $this->owner,
        ]);
    }
}
