<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\RefuseAccountStarts\RefuseAccountStartsCommand;
use App\Sessions\Enums\StartRefusalReason;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An owner that read its account signed in another way refuses the account's unresolved starts on its host.
 */
#[TestsCommand(RefuseAccountStartsCommand::class)]
final class RefuseAccountStartsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_accounts_unresolved_start_is_refused_as_not_signed_in(): void
    {
        $this->journal->owner()->chooseActiveAccounts(config('accounts.root'))->showDriverArrangements()->idleAgent('Coder')->enrollHost('Mac', [base_path()]);
        $opened = $this->journal->openCodexRuntimeOn('Coder', 'Mac', base_path(), 'Run: ls.');
        $this->journal->passCodexProbes('coder', $opened->runtimeId)->callAccountOwner('owner', $opened->runtimeId);

        $this->journal->asSystem(new RefuseAccountStartsCommand($this->journal->hostProcessCalled('owner')->id));

        $this->journal->assertResult(
            StartRefusalReason::NotSignedIn->explanation(),
            $this->journal->startOfSession($opened->sessionId)->refusal,
        );
    }
}
