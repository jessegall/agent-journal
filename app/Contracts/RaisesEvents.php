<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Bus\Exceptions\RowWriteRefused;
use App\Bus\Support\EventCapture;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Model;

/**
 * Keeps the facts a model's own transitions establish, for EventSource. A transition raises only after its own save
 * returned true: assertSaved first, so a refused write raises nothing. A recording model writes only through what
 * the capture sees: a counter changes as an attribute and its own save, never increment; rows go one delete at a
 * time, the ids a fact carries read first, never a bulk delete; and an insert that may meet the row inserts through
 * insertIfAbsent.
 */
trait RaisesEvents
{
    /**
     * @var list<Event>
     */
    private array $raised = [];

    /**
     * Captures each save and delete of the model in the event unit of its connection; the capture is resolved at each
     * call, never kept, so every request and job asks its own.
     */
    public static function bootRaisesEvents(): void
    {
        $capture = static fn (Model&EventSource $row) => Container::getInstance()
            ->make(EventCapture::class)
            ->persisted($row);
        static::saved($capture);
        static::deleted($capture);
    }

    /**
     * @return list<Event>
     */
    public function takeRaisedEvents(): array
    {
        $raised = $this->raised;
        $this->raised = [];

        return $raised;
    }

    /**
     * Inserts this new row unless its key is taken, and answers whether it did; only an inserted row opens its slot
     * in the unit, so the constructor raises its fact only then.
     */
    protected function insertIfAbsent(): bool
    {
        if ($this->usesTimestamps()) {
            $this->updateTimestamps();
        }

        $inserted = static::query()->insertOrIgnore($this->getAttributes()) === 1;

        if ($inserted) {
            $this->exists = true;
            $this->wasRecentlyCreated = true;
            $this->syncOriginal();
            Container::getInstance()->make(EventCapture::class)->persisted($this);
        }

        return $inserted;
    }

    protected function raise(Event $event): void
    {
        $this->raised[] = $event;
    }

    /**
     * @throws RowWriteRefused
     */
    protected function assertSaved(bool $saved): void
    {
        if ($saved) {
            return;
        }

        throw RowWriteRefused::for(static::class);
    }
}
