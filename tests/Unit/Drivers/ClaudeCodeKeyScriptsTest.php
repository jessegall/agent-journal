<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\ClaudeCode\ClaudeCodeKeyScriptBuild;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Setup\DriverProfile;
use App\Support\Recordings\Enums\RecordingMode;
use App\Support\Recordings\Enums\Wire;
use App\Support\Recordings\Recordings;
use App\Terminals\KeyScripts\KeyMove;
use App\Terminals\KeyScripts\KeyScriptCatalogue;
use App\Terminals\KeyScripts\KeyScriptRun;
use App\Terminals\KeyScripts\KeyScriptRunner;
use App\Terminals\Screens\Enums\KeyMoveType;
use App\Values\HostInstructionSource;
use Tests\Support\Hosts\RecordedTerminalHost;
use Tests\TestCase;

/**
 * Claude Code's model and effort scripts replay the recorded slash commands and wait for the matching echo.
 */
final class ClaudeCodeKeyScriptsTest extends TestCase
{
    private const string BUILD = '2.1.332';

    private const int STREAM_MS = 100;

    private const string PROCESS_ID = 'process';

    private const int TURN_INPUT_COUNT = 2;

    /**
     * How many key writes the script made: one per step, and one per arrow of an entry step.
     */
    private int $sends = 0;

    public function test_changing_the_model_types_the_recorded_command_and_confirmation(): void
    {
        $move = $this->played('change-model', 'ChangeModel', ['model' => 'claude-sonnet-5-5']);

        $this->journal->assertResult([KeyMoveType::Finished, 3], [$move->type, $this->sends]);
        $this->journal->recordedTerminalHost(fn (RecordedTerminalHost $host) => $host->assertTypedThrough(4));
    }

    public function test_changing_effort_types_and_submits_the_recorded_command(): void
    {
        $move = $this->played('change-effort', 'ChangeEffort', ['effort' => 'high']);

        $this->journal->assertResult([KeyMoveType::Finished, 2], [$move->type, $this->sends]);
        $this->journal->recordedTerminalHost(fn (RecordedTerminalHost $host) => $host->assertTypedThrough(3));
    }

    public function test_the_model_script_does_not_submit_an_echo_for_another_model(): void
    {
        $host = $this->terminal('change-model');
        $host->userKeys(
            self::PROCESS_ID,
            $host->recordedInputs()[self::TURN_INPUT_COUNT],
            HostInstructionSource::fromJournal(),
        );
        $host->advanceToInput(self::TURN_INPUT_COUNT + 1);
        $script = new KeyScriptCatalogue($this->profile()->keyScripts())
            ->scriptFor(DefaultDrivers::CLAUDE_CODE, self::BUILD, 'ChangeModel');
        $run = new KeyScriptRun($script, ['model' => 'Gemini 9'], step: 1);
        $runner = $this->journal->service(KeyScriptRunner::class);
        $move = $runner->moveOn($this->profile()->layout(), $run, $host->frame());

        $this->journal->assertResult(KeyMoveType::Wait, $move->type);
        $host->assertTypedThrough(self::TURN_INPUT_COUNT);
    }

    public function test_a_build_with_no_script_of_its_own_runs_the_newest_older_builds(): void
    {
        $catalogue = new KeyScriptCatalogue($this->profile()->keyScripts());

        $this->journal->assertResult(
            ClaudeCodeKeyScriptBuild::BUILD,
            $catalogue->scriptFor('claude-code', '2.1.330', 'ChangeModel')->build,
        );
    }

    /**
     * @param  array<string, string>  $values
     */
    private function played(string $recording, string $script, array $values): KeyMove
    {
        $host = $this->terminal($recording);
        $runner = $this->journal->service(KeyScriptRunner::class);
        $layout = $this->profile()->layout();
        $catalogue = new KeyScriptCatalogue($this->profile()->keyScripts());
        $move = KeyMove::wait(new KeyScriptRun($catalogue->scriptFor('claude-code', self::BUILD, $script), $values));

        foreach ($host->streamTimes(self::STREAM_MS) as $time) {
            if ($time < $host->clock->nanoseconds()) {
                continue;
            }

            $host->clock->set($time);
            $frame = $host->frame();
            $move = $runner->moveOn($layout, $move->run, $frame);

            if ($move->type === KeyMoveType::Send) {
                $runner->send($move, $frame, self::PROCESS_ID, 0, HostInstructionSource::fromJournal());
                $this->sends++;
            }

            if (! in_array($move->type, [KeyMoveType::Send, KeyMoveType::Wait], true)) {
                return $move;
            }
        }

        return $move;
    }

    private function terminal(string $scenario): RecordedTerminalHost
    {
        $driver = DefaultDrivers::CLAUDE_CODE;
        $recordings = $this->journal->service(Recordings::class);
        $recording = $recordings->scenario($driver, $scenario);
        $terminal = array_find(
            $recording->exchangesOn(Wire::Driver),
            fn (string $exchange) => $recording->exchange($exchange)->opening->mode === RecordingMode::Terminal,
        );
        $this->assertNotNull($terminal);
        $folder = $recordings->folderOf($driver, $scenario)->child("exchanges/{$terminal}");
        $this->journal->playTerminal($folder, $driver);
        $host = $this->journal->service(RecordedTerminalHost::class);
        $source = HostInstructionSource::fromJournal();

        foreach (array_slice($host->recordedInputs(), 0, self::TURN_INPUT_COUNT) as $keys) {
            $host->userKeys(self::PROCESS_ID, $keys, $source);
        }

        return $host;
    }

    private function profile(): DriverProfile
    {
        return $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE);
    }
}
