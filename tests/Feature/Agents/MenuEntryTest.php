<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Navigation\MenuEntryStatus;
use App\Enums\Navigation\NavigationCompletion;
use App\Models\Access\User;
use App\Models\Drivers\MenuEntry;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Values\MenuStep;
use App\Values\OwnerAuthority;
use App\Values\ScriptGoal;
use Illuminate\Support\Facades\Schema;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\TestCase;

/**
 * A menu library entry belongs to its owner, is found by driver, first screen and goal, carries a stale mark per
 * build and is superseded or retired, never deleted.
 */
final class MenuEntryTest extends TestCase
{
    use CommitsHookRows;
    use RaisesNavigationRequests;
    use RunsTrustedCommands;

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
        'accounts',
        'active_accounts',
        'session_processes',
    ];

    public function test_a_proven_entry_is_found_by_its_program_first_screen_and_goal(): void
    {
        $entry = $this->provenEntry();
        $goal = new ScriptGoal('ChangeModel', 2, ['model' => 'GPT-6']);

        $found = MenuEntry::query()
            ->current()
            ->forDriver('claude-code')
            ->matching('fp1:first', $goal)
            ->firstOrFail();

        $this->assertSame($entry->id, $found->id);
        $this->assertEquals($this->steps(), $found->steps->all());
        $this->assertSame(false, $found->buildOn('2.1.323')?->isStale);
        $this->assertTrue($found->wasProvenElsewhere('2.2.0'));
    }

    public function test_a_stale_mark_holds_for_its_build_only(): void
    {
        $entry = $this->provenEntry();
        $entry->provenOn('2.2.0');

        $entry->markStaleOn('2.1.323', 'label-missing', ['Model: <redacted>']);

        $entry->refresh();
        $this->assertSame(true, $entry->buildOn('2.1.323')?->isStale);
        $this->assertSame(false, $entry->buildOn('2.2.0')?->isStale);
        $this->assertSame(['Model: <redacted>'], $entry->buildOn('2.1.323')?->staleScreen);
        $this->assertSame(MenuEntryStatus::Current, $entry->status);
    }

    public function test_an_entry_is_used_superseded_and_retired_but_kept(): void
    {
        $entry = $this->provenEntry();
        $newer = $this->provenEntry();

        $entry->used();
        $entry->supersededBy($newer);
        $newer->retire();

        $this->assertSame(1, $entry->fresh()?->uses);
        $this->assertSame([MenuEntryStatus::Superseded, $newer->id], [$entry->status, $entry->superseded_by_id]);
        $this->assertSame(MenuEntryStatus::Retired, $newer->fresh()?->status);
        $this->assertSame(0, MenuEntry::query()->current()->count());
        $this->assertSame(2, MenuEntry::query()->count());
    }

    public function test_another_users_actor_reads_none_of_the_library(): void
    {
        $entry = $this->provenEntry();
        $someoneElse = ActorContext::forUser('someone-else');
        $this->app->make(CurrentActorSetter::class)->set($someoneElse, new OwnerAuthority('test'));

        $this->assertNull(MenuEntry::query()->find($entry->id));
        $this->assertSame(0, MenuEntry::query()->count());
    }

    public function test_no_column_names_an_agent_or_a_session(): void
    {
        $columns = Schema::getColumnListing('menu_entries');

        $this->assertSame([], array_values(preg_grep('/agent|session/', $columns) ?: []));
    }

    private function provenEntry(): MenuEntry
    {
        $source = $this->raise($this->stalledScript(), 'raise-1');

        return MenuEntry::create(
            ActorIdentity::ofClass(User::class, 'owner'),
            $source,
            $this->steps(),
            NavigationCompletion::Goal,
            'Set model to GPT-6',
        );
    }

    /**
     * Choosing GPT-6 in the picker, then pressing s to set it for this session.
     *
     * @return non-empty-list<MenuStep>
     */
    private function steps(): array
    {
        return [new MenuStep('fp1:first', 'GPT-6', null, null), new MenuStep('fp1:next', null, 's', 'GPT-6')];
    }
}
