<?php

declare(strict_types=1);

namespace Tests\Fixtures\Engine;

use App\Engine\Contracts\EngineListener;
use App\Engine\Events\EngineTicked;
use App\Engine\Support\EngineLoop;

/**
 * Keeps every EngineTicked it hears and stops the engine loop once it heard the given number.
 */
final class StoppingEngineListener implements EngineListener
{
    /**
     * @var list<EngineTicked>
     */
    public array $heard = [];

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
        $this->heard[] = $event;

        if (count($this->heard) >= $this->stopAfter) {
            $this->loop->stop();
        }
    }
}
