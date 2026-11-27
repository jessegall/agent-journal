<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\OpenAccountOwner\OpenAccountOwnerCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Hosts\HostProcess;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An account's owner opens once the runtime's start is proven, and never a second time while one lives on the host;
 * before the start is proven nothing opens.
 */
#[TestsCommand(OpenAccountOwnerCommand::class)]
final class OpenAccountOwnerTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_one_owner_opens_for_a_proven_start_and_none_before_it(): void
    {
        $this->journal
            ->owner()
            ->chooseActiveAccounts(config('accounts.root'))
            ->showDriverArrangements()
            ->idleAgent('Coder')
            ->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Coder', fn (TestAgent $coder) => $coder
            ->openCodexRuntime('Mac', base_path(), 'Run: ls.'));
        $opened = $this->journal->openedRuntimeOf('Coder');
        $unproven = $this->journal->asSystem(new OpenAccountOwnerCommand($opened->runtimeId));

        $this->journal->withAgent('Coder', fn (TestAgent $coder) => $coder->passCodexProbes('coder'));
        $again = $this->journal->asSystem(new OpenAccountOwnerCommand($opened->runtimeId));

        $this->journal->assertResult(
            [null, null, 1],
            [$unproven, $again, HostProcess::query()->ofPurposes([HostProcessPurpose::AccountOwner])->count()],
        );
    }
}
