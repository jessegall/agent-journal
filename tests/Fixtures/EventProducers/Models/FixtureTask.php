<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventProducers\Models;

use App\Contracts\Event;
use Illuminate\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Model;
use Tests\Fixtures\EventProducers\Events\FixtureChanged;
use Tests\Fixtures\EventProducers\Events\FixtureFinished;
use Tests\Fixtures\EventProducers\Events\FixtureHeld;

/**
 * A model that raises its facts on itself, and one that sends an event through a dispatcher from the container.
 *
 * @property string $state
 */
final class FixtureTask extends Model
{
    /**
     * @var list<Event>
     */
    private array $raised = [];

    public function finish(): void
    {
        $this->state = 'finished';
        $this->save();
        $this->raise(new FixtureFinished((string) $this->id));
    }

    public function hold(): void
    {
        $this->state = 'held';
        $this->save();
        $this->raise(new FixtureHeld($this));
    }

    public function announce(): void
    {
        Container::getInstance()->make(Dispatcher::class)->dispatch(new FixtureChanged((string) $this->id));
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

    private function raise(Event $event): void
    {
        $this->raised[] = $event;
    }
}
