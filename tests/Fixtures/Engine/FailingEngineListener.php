<?php

declare(strict_types=1);

namespace Tests\Fixtures\Engine;

use App\Engine\Contracts\EngineListener;
use App\Engine\Events\EngineTicked;
use App\Engine\Support\EngineAccess;
use RuntimeException;

/**
 * An engine listener that records which scopes it was granted, then fails.
 */
final class FailingEngineListener implements EngineListener
{
    /**
     * @var list<string>
     */
    public array $allowed = [];

    public function __construct(private readonly EngineAccess $access) {}

    public function maintenanceScope(): string
    {
        return 'fixtures.first';
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->allowed = SeenScopes::of($this->access, ['fixtures.first', 'fixtures.second']);

        throw new RuntimeException('The first listener failed.');
    }
}
