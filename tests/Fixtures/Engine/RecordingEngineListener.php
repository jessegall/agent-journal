<?php

declare(strict_types=1);

namespace Tests\Fixtures\Engine;

use App\Engine\Contracts\EngineListener;
use App\Engine\Events\EngineTicked;
use App\Engine\Support\EngineAccess;

/**
 * An engine listener that keeps the events it heard and which scopes it was granted.
 */
final class RecordingEngineListener implements EngineListener
{
    /**
     * @var list<EngineTicked>
     */
    public array $heard = [];

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
        $this->heard[] = $event;
        $this->allowed = SeenScopes::of($this->access, ['fixtures.first', 'fixtures.second']);
    }
}
