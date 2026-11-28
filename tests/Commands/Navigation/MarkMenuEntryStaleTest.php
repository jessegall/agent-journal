<?php

declare(strict_types=1);

namespace Tests\Commands\Navigation;

use App\Agents\Drivers\Values\MenuStep;
use App\Hosts\EnrolledHost;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\MenuEntry;
use App\Navigation\Commands\MarkMenuEntryStale\MarkMenuEntryStaleCommand;
use App\Navigation\Enums\NavigationCompletion;
use App\Navigation\Enums\NavigationReason;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A host whose replay of the owner's menu entry failed on a build marks the entry stale there with why and the screen
 * it saw; marking it again keeps the first mark, and an entry the owner does not have is refused.
 */
#[TestsCommand(MarkMenuEntryStaleCommand::class)]
final class MarkMenuEntryStaleTest extends TestCase
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
        'users',
        'inboxes',
        'inbox_members',
        'accounts',
        'active_accounts',
        'session_processes',
    ];

    public function test_the_entry_goes_stale_on_the_build_once_with_its_reason_and_screen(): void
    {
        $this->journal->installInboxes();
        [$host, $opened] = $this->openRuntime();
        $stalled = DriverRequest::query()->with('runtime')->findOrFail(
            $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']))->requestId,
        );
        $entry = $this->entryFrom($stalled);

        $this->stale($host, $entry->id, $stalled->agent_runtime_id, ['Model: GPT-5']);
        $this->stale($host, $entry->id, $stalled->agent_runtime_id, ['Something else']);

        $build = $entry->refresh()->buildOn('2.1.332');
        $this->assertTrue($build?->isStale);
        $this->assertSame(['Model: GPT-5'], $build->staleScreen);
        $this->assertStringStartsWith(NavigationReason::LabelMissing->value, (string) $build->staleReason);
    }

    public function test_an_entry_the_owner_does_not_have_is_refused(): void
    {
        $this->journal->installInboxes();
        [$host, $opened] = $this->openRuntime();

        $this->assertThrows(
            fn () => $this->stale($host, '01jd8x0g9m3qz6v4k2t7r00000', $opened->runtimeId, ['Model: GPT-5']),
        );
    }

    /**
     * @param  list<string>  $rows
     */
    private function stale(EnrolledHost $host, string $entryId, string $runtimeId, array $rows): void
    {
        $this->journal->asSystem(new MarkMenuEntryStaleCommand(
            $host->hostId,
            $entryId,
            $runtimeId,
            NavigationReason::LabelMissing,
            2,
            '2.1.332',
            $rows,
        ));
    }

    private function entryFrom(DriverRequest $stalled): MenuEntry
    {
        $source = $this->raise($stalled, 'raise-1');
        $source->cancel();

        return MenuEntry::create(
            $this->journal->actorCalled('Owner'),
            $source,
            [new MenuStep('fp1:first', 'GPT-6', null, null)],
            NavigationCompletion::Goal,
            'GPT-6',
        );
    }
}
