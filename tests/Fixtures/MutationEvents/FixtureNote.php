<?php

declare(strict_types=1);

namespace Tests\Fixtures\MutationEvents;

use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use Illuminate\Database\Eloquent\Model;
use Tests\Fixtures\EventProducers\Events\FixtureFinished;

/**
 * A model with one mutation that raises its fact, one that reaches it through its own method, and one that raises none.
 *
 * @property string $state
 * @property string $title
 */
final class FixtureNote extends Model implements EventSource
{
    use RaisesEvents;

    // ----------[ Mutations ]----------

    public function finish(): void
    {
        $this->state = 'finished';
        $this->assertSaved($this->save());
        $this->raise(new FixtureFinished((string) $this->id));
    }

    public function finishWithTitle(string $title): void
    {
        $this->title = $title;
        $this->finish();
    }

    public function rename(string $title): void
    {
        $this->title = $title;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function isFinished(): bool
    {
        return $this->state === 'finished';
    }
}
