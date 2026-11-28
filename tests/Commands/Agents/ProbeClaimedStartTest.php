<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\ProbeClaimedStart\ProbeClaimedStartCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Agents\AgentSession;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\HostDriverImageWait;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A claimed contained start is probed in its host's driver image once the image is ready, and the session freezes that
 * image; a start whose image is not built yet waits for it and is not probed.
 */
#[TestsCommand(ProbeClaimedStartCommand::class)]
final class ProbeClaimedStartTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_start_on_a_ready_image_is_probed_once_and_its_session_freezes_the_image(): void
    {
        $this->journal->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->arrangeContainedJournal()
            ->idleAgent('Boxed')
            ->enrollContainedHost('Box', [base_path()])
            ->readyDriverImagesOn('Box');
        $this->journal->withAgent('Boxed', fn (TestAgent $boxed) => $boxed->openRuntime('Box', base_path()));
        $opened = $this->journal->openedRuntimeOf('Boxed');
        $start = $this->journal->startOfSession($opened->sessionId);

        $this->journal->asSystem(new ProbeClaimedStartCommand($start->id));

        $this->journal->assertResult(
            [1, true],
            [
                HostProcess::query()->ofStarts([$start->id])->ofPurposes([HostProcessPurpose::BuildProbe])->count(),
                str_starts_with(AgentSession::query()->findOrFail($opened->sessionId)->frozenDriverImage(), 'sha256:'),
            ],
        );
    }

    public function test_a_start_whose_image_is_not_built_waits_for_it_unprobed(): void
    {
        $this->journal->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->arrangeContainedJournal()
            ->idleAgent('Boxed')
            ->enrollContainedHost('Box', [base_path()]);
        $this->journal->withAgent('Boxed', fn (TestAgent $boxed) => $boxed->openRuntime('Box', base_path()));
        $start = $this->journal->startOfSession($this->journal->openedRuntimeOf('Boxed')->sessionId);

        $this->journal->asSystem(new ProbeClaimedStartCommand($start->id));

        $this->journal->assertResult(
            [true, false],
            [HostDriverImageWait::hasOfStart($start->id), HostProcess::hasBuildProbeOf($start->id)],
        );
    }
}
