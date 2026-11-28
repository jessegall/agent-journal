<?php

declare(strict_types=1);

namespace App\Agents\Activity\Data;

use App\Web\Creation\Exceptions\MissingFields;

final class ActivityWindowDataFields
{
    /** @var list<ActivityEventData> */
    private array $events;

    private bool $hasOlder;

    /** @param list<ActivityEventData> $events */
    public function events(array $events): self
    {
        $this->events = $events;

        return $this;
    }

    public function hasOlder(bool $hasOlder): self
    {
        $this->hasOlder = $hasOlder;

        return $this;
    }

    public function finish(): ActivityWindowData
    {
        if (! isset($this->events)) {
            throw MissingFields::forType(ActivityWindowData::class, 'events');
        }

        if (! isset($this->hasOlder)) {
            throw MissingFields::forType(ActivityWindowData::class, 'hasOlder');
        }

        return new ActivityWindowData(
            events: $this->events,
            hasOlder: $this->hasOlder,
        );
    }
}
