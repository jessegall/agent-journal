<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Contracts\Events\Event;
use App\Contracts\Events\EventSource;
use App\Exceptions\RowWriteRefused;
use App\Reads\Contracts\RowCapture;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Model;

/**
 * Keeps the facts a model's own transitions establish, for EventSource; a transition raises only after its save
 * returned true. A recording model writes only what the capture sees: a counter as an attribute and its save, one
 * delete at a time, and an insert that may meet its row through insertIfAbsent.
 */
trait RaisesEvents
{
    use InsertsAbsentRows;

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
            ->make(RowCapture::class)
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

    protected function raise(Event $event): void
    {
        $this->raised[] = $event;
    }

    /**
     * Saves the row, and refuses the write when the save did not happen.
     *
     * @throws RowWriteRefused
     */
    protected function saveAndAssert(): void
    {
        if ($this->save()) {
            return;
        }

        throw RowWriteRefused::for(static::class);
    }

    /**
     * Deletes the row, and refuses the write when the delete did not happen.
     *
     * @throws RowWriteRefused
     */
    protected function deleteAndAssert(): void
    {
        if ($this->delete()) {
            return;
        }

        throw RowWriteRefused::for(static::class);
    }
}
