<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Access\AccessSettings;
use App\Actors\Contracts\ActorAttention;
use App\Agents\Drivers\Commands\NotifyEntryReplayed\NotifyEntryReplayedCommand;
use App\Agents\Drivers\Values\MenuStep;
use App\Models\Access\User;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\MenuEntry;
use App\Models\Drivers\NavigationRequest;
use App\Navigation\Enums\NavigationCompletion;
use App\Navigation\Enums\NavigationReason;
use App\Support\ActorReference;
use App\Values\NavigationScreen;
use App\Values\NavigationUncertainty;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\RecordedAttention;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A host reports a menu entry it replayed: the replay counts once per operation and lists the build it ran on.
 */
#[TestsCommand(NotifyEntryReplayedCommand::class)]
final class NotifyEntryReplayedTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;

    private const array TABLES = [
        'users',
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
        'inboxes', 'inbox_members',
        'assignments',
        'accounts',
        'active_accounts',
        'session_processes',
    ];

    private const string FINGERPRINT = 'fp1:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    private RecordedAttention $attention;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);
    }

    #[TimeLimit(seconds: 30, reason: 'It opens fifty runtimes with different goals before the matching raise.')]
    public function test_the_replayed_report_counts_once_and_lists_the_build(): void
    {
        $entry = $this->libraryEntry('2.1.300');
        [$host, $opened] = $this->openRuntime();
        $replayed = new NotifyEntryReplayedCommand($host->hostId, $entry->id, $opened->runtimeId, 'replay-1');

        $this->journal->asSystem($replayed);
        $this->journal->asSystem($replayed);

        $entry = MenuEntry::query()->acrossActors()->findOrFail($entry->id);
        $this->assertSame(1, $entry->uses);
        $this->assertSame(false, $entry->buildOn('2.1.323')?->isStale);
    }

    /**
     * An entry of the owner's library, proven on the build, that chooses GPT-6 on the picker the raises show.
     */
    private function libraryEntry(string $build): MenuEntry
    {
        $source = $this->librarySource($build);
        $steps = [new MenuStep(self::FINGERPRINT, 'GPT-6', null, null)];

        return MenuEntry::create($source->actor(), $source, $steps, NavigationCompletion::Goal, 'GPT-6');
    }

    private function librarySource(string $build): NavigationRequest
    {
        [, $opened] = $this->openRuntime(build: $build);
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']));
        $request = DriverRequest::query()->with('runtime')->findOrFail($receipt->requestId);
        $source = $this->navigationFor($request);
        $source->cancel();

        return $source;
    }

    private function navigationFor(DriverRequest $request): NavigationRequest
    {
        $screen = new NavigationScreen(['Model: GPT-5', '❯ GPT-6'], 1, 7);
        $uncertainty = new NavigationUncertainty(NavigationReason::LabelMissing, 2, self::FINGERPRINT, $screen);
        $owner = ActorReference::ofClass(User::class, 'owner');

        return NavigationRequest::create($request, $owner, $uncertainty, 'source', CarbonImmutable::now());
    }
}
