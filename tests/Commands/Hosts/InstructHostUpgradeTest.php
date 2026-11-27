<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\InstructHostUpgrade\InstructHostUpgradeCommand;
use App\Hosts\Exceptions\HostUpgradeRefused;
use App\Hosts\Protocol\HostInstructionType;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The upgrade is ordered only to a host with no live process.
 */
#[TestsCommand(InstructHostUpgradeCommand::class)]
final class InstructHostUpgradeTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->publishRelease('6.1.0')->enrollHost('Mac', [base_path()]);
    }

    public function test_it_instructs_the_upgrade_and_answers_the_instructions_id(): void
    {
        $instructionId = $this->journal->asSystem(new InstructHostUpgradeCommand($this->journal->hostCalled('Mac')->hostId));

        $instruction = $this->journal->hostInstructionsOn('Mac')[0];
        $this->journal->assertResult([$instructionId, HostInstructionType::Upgrade], [$instruction->id, $instruction->type]);
    }

    public function test_it_is_refused_while_a_process_lives_on_the_host(): void
    {
        $this->journal->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell'));

        $this->journal->assertRefused(
            HostUpgradeRefused::class,
            fn () => $this->journal->asSystem(new InstructHostUpgradeCommand($this->journal->hostCalled('Mac')->hostId)),
        );
    }
}
