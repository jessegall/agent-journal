<?php

declare(strict_types=1);

namespace Tests\Fixtures\Mcp;

use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;

/**
 * A server holding only the fixture read tool.
 */
#[Name('fixture')]
#[Version('1.0.0')]
final class FixtureServer extends Server
{
    protected array $tools = [FixtureReadTool::class];
}
