<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use App\Support\AgentImage;
use Tests\TestCase;

/**
 * A driver image's build takes the agent image by name: one pinned by its bare id by the name the loader holds it
 * under, made of that id, and one pinned by a name as that name.
 */
final class AgentImageTest extends TestCase
{
    public function test_a_build_takes_the_agent_image_by_a_name(): void
    {
        $this->assertSame(
            ['journal-agent-base:bb45', 'registry.example/journal@sha256:bb45'],
            [
                AgentImage::fromConfig('sha256:bb45')->buildBase(),
                AgentImage::fromConfig('registry.example/journal@sha256:bb45')->buildBase(),
            ],
        );
    }
}
