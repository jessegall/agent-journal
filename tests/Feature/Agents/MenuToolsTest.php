<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Enums\Navigation\NavigationCompletion;
use App\Models\Access\User;
use App\Models\Drivers\MenuEntry;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Values\MenuStep;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The menu tools list and show the owner's entries and why one went stale, page past one page with its total, and
 * find no entry of another actor.
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
        $this->caller = TestStart::start();
    }

    public function test_the_list_and_show_give_the_owners_entries_and_why_one_went_stale(): void
    {
        $entry = $this->entryOf('owner');
        $entry->markStaleOn('2.1.323', 'label-missing', ['Model: <redacted>']);

        $listed = $this->callMcpTool($this->caller, 'menu_list')
            ->assertJsonPath('result.isError', false)
            ->json('result.structuredContent.cards');
        $shown = $this->callMcpTool($this->caller, 'menu_show', ['entry' => $entry->id])
            ->assertJsonPath('result.isError', false)
            ->json('result.structuredContent');

        $this->assertSame([$entry->id], array_column($listed, 'id'));
        $this->assertSame([['build' => '2.1.323', 'stale' => true]], $listed[0]['builds']);
        $this->assertSame('label-missing', $shown['builds'][0]['stale_reason']);
        $this->assertSame(['Model: <redacted>'], $shown['builds'][0]['stale_screen']);
        $this->assertSame('GPT-6', $shown['steps'][0]['choose']);
    }

    #[TimeLimit(20, 'It proves 51 menu entries, one stalled script each.')]
    public function test_a_list_past_one_page_names_its_total_and_the_next_page_reads_the_rest(): void
    {
        $ids = array_map(fn (int $count) => $this->entryOf('owner')->id, range(1, 51));

        $answer = $this->callMcpTool($this->caller, 'menu_list')->json('result.structuredContent');
        $total = $answer['total'];
        $listed = array_column($answer['cards'], 'id');

        for ($read = 1; ($answer['next_actions'] ?? []) !== [] && $read < 10; $read++) {
            $next = $answer['next_actions'][0];
            $answer = $this->callMcpTool(
                $this->caller,
                $next['tool'],
                $next['arguments'],
            )->json('result.structuredContent');
            $listed = [...$listed, ...array_column($answer['cards'], 'id')];
        }

        $this->assertSame(51, $total);
        $this->assertGreaterThan(1, $read);
        $this->assertCount(51, $listed);
        $this->assertEqualsCanonicalizing($ids, $listed);
    }

    public function test_another_actors_entry_is_not_found(): void
    {
        $entry = $this->entryOf('someone-else');

        $this->callMcpTool($this->caller, 'menu_show', ['entry' => $entry->id])
            ->assertJsonPath('result.isError', true);
        $listed = $this->callMcpTool($this->caller, 'menu_list')->json('result.structuredContent.cards');
        $this->assertSame([], $listed);
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
