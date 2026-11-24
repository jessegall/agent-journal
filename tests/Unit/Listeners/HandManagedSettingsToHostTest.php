<?php

declare(strict_types=1);

namespace Tests\Unit\Listeners;

use App\Contracts\Files\Files;
use App\Events\StartGrantRequested;
use App\Listeners\HandManagedSettingsToHost;
use App\Support\ArrangementSetting;
use App\Support\StartAdditions;
use Tests\TestCase;

/**
 * A contained start gets Claude Code's managed settings with its grant, as the one file of its managed folder the
 * container mounts read-only; a local start gets none, since no container mounts it.
 */
final class HandManagedSettingsToHostTest extends TestCase
{
    public function test_a_contained_start_gets_the_managed_settings_as_they_are_written(): void
    {
        $additions = $this->grantIn(ArrangementSetting::fromConfig('contained', 'acme', '{"main":{"folder":"main"}}'));

        $this->assertSame('managed', $additions->folders()[0]->name);
        $this->assertSame('managed-settings.json', $additions->folders()[0]->files[0]->path);
        $this->assertSame(
            (string) file_get_contents(base_path('resources/agents/claude-code-managed-settings.json')),
            $additions->folders()[0]->files[0]->content,
        );
    }

    public function test_a_local_start_gets_none(): void
    {
        $additions = $this->grantIn(ArrangementSetting::fromConfig('local', '', '{}'));

        $this->assertSame([], $additions->folders());
    }

    private function grantIn(ArrangementSetting $arrangement): StartAdditions
    {
        $additions = new StartAdditions();
        new HandManagedSettingsToHost($arrangement, $this->app->make(Files::class))
            ->handle(new StartGrantRequested('session-1', $additions));

        return $additions;
    }
}
