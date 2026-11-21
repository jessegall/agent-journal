<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Bus\Exceptions\RowWriteRefused;
use App\Bus\Support\EventCapture;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Model;

/**
 * Keeps the facts a model's own transitions establish, for EventSource. A transition raises only after its own save
 * returned true: assertSaved first, so a refused write raises nothing.
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
