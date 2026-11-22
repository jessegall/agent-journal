<?php

declare(strict_types=1);

namespace Tests\Fixtures\Engine;

use App\Contracts\Events\EngineListener;
use App\Events\EngineTicked;
use App\Support\EngineLoop;

/**
 * Keeps every EngineTicked it receives and stops the engine loop once it received the given number.
 */
final class StoppingEngineListener implements EngineListener
{
    /**
     * @var list<EngineTicked>
     */
    public array $received = [];

    public function __construct(
        private readonly EngineLoop $loop,
        private readonly int $stopAfter,
    ) {}

    public function maintenanceScope(): string
    {
        return 'fixtures.stop';
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->received[] = $event;

        if (count($this->received) >= $this->stopAfter) {
            $this->loop->stop();
        }
    }
}
