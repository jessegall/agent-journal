<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\Agents\Drivers\Commands\RecordOwnTerminal\RecordOwnTerminalCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\CommandMiddleware\AskRawBytes;
use App\Files\Enums\Place;
use App\Hosts\Protocol\HostProcessType;
use App\Support\Recordings\Enums\RecordingMode;
use App\Support\Recordings\RecordingDrafts;
use App\Support\Recordings\Scenarios\Scenario;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\Files\UsesTemporaryPlaces;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * While recording is on, a terminal is opened asking for its raw bytes; with recording off, or for pipes, it is not.
 */
#[TestsMiddleware(AskRawBytes::class)]
final class AskRawBytesTest extends TestCase
{
    use RefreshHookDatabase;
    use UsesTemporaryPlaces;

    public function test_a_terminal_asks_for_its_raw_bytes_only_while_recording_is_on(): void
    {
        $this->placeInTemporaryFolder(Place::Project);
        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('before'));
        $this->journal->switchRecordingOn();
        $this->journal->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('recorded')
            ->openProcess('piped', HostProcessType::Pipe));

        $this->assertSame(
            [false, true, false],
            [
                $this->journal->payloadOf($this->journal->hostInstructionsOf('before')[0])['raw_bytes'],
                $this->journal->payloadOf($this->journal->hostInstructionsOf('recorded')[0])['raw_bytes'],
                $this->journal->payloadOf($this->journal->hostInstructionsOf('piped')[0])['raw_bytes'],
            ],
        );
    }

    public function test_the_recorded_terminal_opening_keeps_its_size_and_omits_its_grant_value(): void
    {
        $this->placeInTemporaryFolder(Place::Project);
        $this->journal->switchRecordingOn();
        $drafts = $this->journal->service(RecordingDrafts::class);
        $drafts->openRun(Scenario::read('claude-code/terminal-turn', '{"description":"terminal","steps":[]}'));
        $opened = $this->journal->owner()
            ->showDriverArrangements()
            ->chooseActiveAccounts()
            ->enrollHost('Mac', [base_path()])
            ->idleAgent('Driver')
            ->withAgent('Driver', fn (TestAgent $agent) => $agent
                ->openRuntime('Mac', base_path(), driverType: DriverType::ofOwnTerminal()))
            ->openedRuntimeOf('Driver');

        $recorded = $this->journal->asSystem(new RecordOwnTerminalCommand($opened->runtimeId));
        $drafts->closeRun();
        [$terminal] = $drafts->run()->exchanges;
        $this->journal->assertResult(
            [$recorded->processId, RecordingMode::Terminal, $recorded->plan->columns, $recorded->plan->rows, true],
            [$terminal->opening->exchange, $terminal->opening->mode, $terminal->opening->columns,
                $terminal->opening->rows, $recorded->plan->isRawBytes],
        );
        $this->assertSame('{env:JOURNAL_START_TOKEN}', $terminal->opening->environment['JOURNAL_START_TOKEN']);
    }
}
