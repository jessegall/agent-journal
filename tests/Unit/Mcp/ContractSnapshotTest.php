<?php

declare(strict_types=1);

namespace Tests\Unit\Mcp;

use App\Mcp\Support\ContractSnapshot;
use App\Support\DomainRegistry;
use Illuminate\Filesystem\Filesystem;
use Tests\TestCase;

final class ContractSnapshotTest extends TestCase
{
    private const string CHANGED = 'MCP contract changes: %s. Regenerate with mcp:contract.';

    /**
     * Every installed domain, since the tools of them all are what this test reads.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    public function test_published_contract_matches_the_catalogue(): void
    {
        $snapshot = $this->app->make(ContractSnapshot::class);
        $files = $this->app->make(Filesystem::class);
        $recorded = $files->get(base_path(ContractSnapshot::PATH));
        $current = $snapshot->render();
        $changes = implode(', ', $snapshot->differences($recorded, $current));

        self::assertSame($recorded, $current, sprintf(self::CHANGED, $changes));
    }

    public function test_a_schema_change_names_the_tool_and_profile(): void
    {
        $snapshot = $this->app->make(ContractSnapshot::class);
        $recorded = $snapshot->render();
        $modified = json_decode($recorded, flags: JSON_THROW_ON_ERROR);
        $modified->profiles->{'main-agent'}->docs_read->inputSchema->properties->revision->minimum = 2;

        self::assertSame(
            ['main-agent/docs_read'],
            $snapshot->differences($recorded, json_encode($modified, JSON_THROW_ON_ERROR)),
        );
    }
}
