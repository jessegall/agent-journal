<?php

declare(strict_types=1);

namespace Tests\Fixtures\Engine;

use App\Contracts\EngineListener;
use App\Events\EngineTicked;
use App\Support\EngineAccess;

/**
 * An engine listener that keeps the events it received and which scopes it was granted.
 */
final class RecordingEngineListener implements EngineListener
{
    /**
     * @var list<EngineTicked>
     */
    public array $received = [];

    /**
     * @var list<string>
     */
    public array $allowed = [];

    public function __construct(private readonly EngineAccess $access) {}

    public function maintenanceScope(): string
    {
        return 'fixtures.second';
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->received[] = $event;
        $this->allowed = SeenScopes::of($this->access, ['fixtures.first', 'fixtures.second']);
    }
}
