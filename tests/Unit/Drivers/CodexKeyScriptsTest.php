<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Setup\DriverProfile;
use App\Hosts\Protocol\Payloads\HostFramePayload;
use App\Terminals\KeyScripts\KeyMove;
use App\Terminals\KeyScripts\KeyScriptCatalogue;
use App\Terminals\KeyScripts\KeyScriptRun;
use App\Terminals\KeyScripts\KeyScriptRunner;
use App\Terminals\Screens\Enums\KeyMoveType;
use App\Terminals\Screens\ScreenClassifier;
use App\Terminals\Screens\ScreenHolds;
use App\Terminals\Screens\ScreenLayout;
use App\Values\HostInstructionSource;
use Tests\Support\Hosts\MockHost;
use Tests\TestCase;

/**
 * Codex's key scripts type, on the recorded screens, exactly what the recording's user typed: the /model command, the
 * model or the reasoning level reached one drawn arrow at a time, and Enter on each picker.
 */
final class CodexKeyScriptsTest extends TestCase
{
    private const string KEY_SCRIPTS = 'codex/0.165.0/keyscripts';

    private const string BUILD = '0.172.0';

    private const int STREAM_MS = 100;

    /**
     * How many key writes the script made: one per step, and one per arrow of an entry step.
     */
    private int $sends = 0;

    public function test_choosing_a_model_types_what_the_user_typed_and_keeps_its_default_reasoning(): void
    {
        $move = $this->played('model-choice', 'ChangeModel', ['model' => 'gpt-6-luna']);

        $this->journal->assertResult(KeyMoveType::Finished, $move->type);
        $this->journal->mockHost(fn (MockHost $host) => $host->assertTypedThrough(15));
    }

    public function test_choosing_an_effort_keeps_the_current_model_and_moves_to_the_level(): void
    {
        // The recording drew a ready composer before its background server's question, so the script typed there
        // and the recording's own answer to that question is passed over.
        $move = $this->played('effort-change', 'ChangeEffort', ['effort' => 'low']);

        $this->journal->assertResult([KeyMoveType::Finished, 5], [$move->type, $this->sends]);
    }

    /**
     * Streams the recording's frames to the script until it finishes or stops, sending each key it decides on.
     *
     * @param  array<string, string>  $values
     */
    private function played(string $recording, string $script, array $values): KeyMove
    {
        $this->journal->playRecording(self::KEY_SCRIPTS."/{$recording}");
        $host = $this->journal->service(MockHost::class);
        $runner = $this->journal->service(KeyScriptRunner::class);
        $layout = $this->profile()->layout();
        $catalogue = new KeyScriptCatalogue($this->profile()->keyScripts());
        $move = KeyMove::wait(new KeyScriptRun(
            $catalogue->scriptFor(DefaultDrivers::CODEX, self::BUILD, $script),
            $values,
        ));

        foreach ($host->streamTimes(self::STREAM_MS) as $time) {
            $host->clock->set($time);
            $frame = $host->frame();
            $answer = $this->answerOf($layout, $frame);

            // A screen the layout answers is passed with its recorded answer, as the terminal driver passes it.
            if ($answer !== null) {
                $host->write('process', $answer, HostInstructionSource::fromJournal());

                continue;
            }

            $move = $runner->moveOn($layout, $move->run, $frame);

            if ($move->type === KeyMoveType::Send) {
                $runner->send($move, $frame, 'process', 0, HostInstructionSource::fromJournal());
                $this->sends++;
            }

            if (! in_array($move->type, [KeyMoveType::Send, KeyMoveType::Wait], true)) {
                return $move;
            }
        }

        return $move;
    }

    private function answerOf(ScreenLayout $layout, HostFramePayload $frame): string|null
    {
        $reading = new ScreenClassifier()->readingOf($layout, $frame);

        return $reading->isStill ? new ScreenHolds()->holdOf($reading)->answer : null;
    }

    private function profile(): DriverProfile
    {
        return $this->journal->driverProfile(DefaultDrivers::CODEX);
    }
}
