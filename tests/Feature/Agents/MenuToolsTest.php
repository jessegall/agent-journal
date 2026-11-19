<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\RetireMenuEntry;
use App\Agents\Enums\MenuEntryState;
use App\Agents\Enums\NavigationCompletion;
use App\Agents\Models\MenuEntry;
use App\Agents\Values\MenuStep;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsMcpFrames;
use Tests\TestCase;

/**
 * The menu tools read the journal owner's library, show why an entry went stale on a build, and only the owner
 * retires an entry, after which no lookup finds it; another actor's entry is never found.
 */
final class MenuToolsTest extends TestCase
{
    use CommitsHookRows;
    use RaisesNavigationRequests;
    use RunsTrustedCommands;
    use SendsMcpFrames;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'navigation_requests',
        'menu_entries',
        'command_receipts',
    ];

    private TestLaunch $caller;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->caller = TestLaunch::start();
    }

    public function test_the_list_and_show_give_the_owners_entries_and_why_one_went_stale(): void
    {
        $entry = $this->entryOf('owner');
        $entry->markStaleOn('2.1.323', 'label-missing', ['Model: <redacted>']);

        $listed = $this->callMcpTool($this->caller, 'menu_list')
            ->assertJsonPath('result.isError', false)
            ->json('result.structuredContent.entries');
        $shown = $this->callMcpTool($this->caller, 'menu_show', ['entry' => $entry->id])
            ->assertJsonPath('result.isError', false)
            ->json('result.structuredContent');

        $this->assertSame([$entry->id], array_column($listed, 'id'));
        $this->assertSame([['build' => '2.1.323', 'stale' => true]], $listed[0]['builds']);
        $this->assertSame('label-missing', $shown['builds'][0]['stale_reason']);
        $this->assertSame(['Model: <redacted>'], $shown['builds'][0]['stale_screen']);
        $this->assertSame('GPT-6', $shown['steps'][0]['choose']);
    }

    public function test_another_actors_entry_is_not_found(): void
    {
        $entry = $this->entryOf('someone-else');

        $this->callMcpTool($this->caller, 'menu_show', ['entry' => $entry->id])
            ->assertJsonPath('result.isError', true);
        $listed = $this->callMcpTool($this->caller, 'menu_list')->json('result.structuredContent.entries');
        $this->assertSame([], $listed);
    }

    public function test_only_the_owner_retires_an_entry_and_no_lookup_finds_it_after(): void
    {
        $entry = $this->entryOf('owner');

        $this->callMcpTool($this->caller, 'menu_retire', ['entry' => $entry->id, 'expected_state' => 'current'])
            ->assertJsonPath('result.isError', true);
        $this->asOwner(new RetireMenuEntry($entry->id, MenuEntryState::Current));

        $owner = new ActorIdentity(ActorType::User, 'owner');
        $this->assertSame(MenuEntryState::Retired, $entry->fresh()?->state);
        $this->assertSame(0, MenuEntry::query()->ownedBy($owner)->current()->count());
    }

    private function entryOf(string $owner): MenuEntry
    {
        $source = $this->raise($this->stalledScript(), 'raise-1');
        $source->cancel();
        $steps = [new MenuStep('fp1:first', 'GPT-6', null, null)];

        return MenuEntry::proven(
            new ActorIdentity(ActorType::User, $owner),
            $source,
            $steps,
            NavigationCompletion::Goal,
            'GPT-6',
        );
    }
}
