<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\OpenAccountOwner\OpenAccountOwnerCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Hosts\HostProcess;
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
        $this->journal->owner()->chooseActiveAccounts(config('accounts.root'))->showDriverArrangements()->idleAgent('Coder')->enrollHost('Mac', [base_path()]);
        $opened = $this->journal->openCodexRuntimeOn('Coder', 'Mac', base_path(), 'Run: ls.');
        $unproven = $this->journal->asSystem(new OpenAccountOwnerCommand($opened->runtimeId));

        $this->journal->passCodexProbes('coder', $opened->runtimeId);
        $again = $this->journal->asSystem(new OpenAccountOwnerCommand($opened->runtimeId));

        $this->journal->assertResult(
            [null, null, 1],
            [$unproven, $again, HostProcess::query()->ofPurposes([HostProcessPurpose::AccountOwner])->count()],
        );
    }
}
