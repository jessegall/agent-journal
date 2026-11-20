<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Mcp\Support\ContractSnapshot;
use Illuminate\Filesystem\Filesystem;
use Tests\TestCase;

final class ContractSnapshotTest extends TestCase
{
    public function test_published_contract_matches_the_catalogue(): void
    {
        $snapshot = $this->app->make(ContractSnapshot::class);
        $files = $this->app->make(Filesystem::class);
        $recorded = $files->get(base_path(ContractSnapshot::PATH));
        $current = $snapshot->render();
        $changes = implode(', ', $snapshot->differences($recorded, $current));

        self::assertSame($recorded, $current, 'MCP contract changes: '.$changes.'. Regenerate with mcp:contract.');
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
