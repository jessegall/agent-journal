<?php

declare(strict_types=1);

namespace Tests\Commands\Navigation;

use App\Commands\Navigation\RetireMenuEntry\RetireMenuEntryCommand;
use App\Enums\Navigation\MenuEntryStatus;
use App\Enums\Navigation\NavigationCompletion;
use App\Models\Access\User;
use App\Models\Drivers\MenuEntry;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Values\MenuStep;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Only the owner retires a menu entry, and no lookup finds it after.
 */
#[TestsCommand(RetireMenuEntryCommand::class)]
final class RetireMenuEntryTest extends TestCase
{
    use CommitsHookRows;
    use RaisesNavigationRequests;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'navigation_requests',
        'menu_entries',
        'command_receipts',
        'accounts',
        'active_accounts',
        'session_processes',
    ];

    private TestStart $caller;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->caller = $this->journal->signedStart('Test agent');
    }

    #[TimeLimit(20, 'It proves 51 menu entries, one stalled script each.')]
    public function test_only_the_owner_retires_an_entry_and_no_lookup_finds_it_after(): void
    {
        $entry = $this->entryOf('owner');

        $this->journal->mcpRequest($this->caller, 'tools/call', [
            'name' => 'menu_retire',
            'arguments' => ['entry' => $entry->id, 'expected_state' => 'current', 'request_key' => 'retire'],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);
        $this->asOwner(new RetireMenuEntryCommand($entry->id, MenuEntryStatus::Current));

        $owner = ActorIdentity::ofClass(User::class, 'owner');
        $this->assertSame(MenuEntryStatus::Retired, $entry->fresh()?->status);
        $this->assertSame(0, MenuEntry::query()->ownedBy($owner)->current()->count());
    }

    private function entryOf(string $owner): MenuEntry
    {
        $source = $this->raise($this->stalledScript(), 'raise-1');
        $source->cancel();
        $steps = [new MenuStep('fp1:first', 'GPT-6', null, null)];

        return MenuEntry::create(
            ActorIdentity::ofClass(User::class, $owner),
            $source,
            $steps,
            NavigationCompletion::Goal,
            'GPT-6',
        );
    }
}
