<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Setup\DriverProfile;
use App\Data\Hosts\HostFrameData;
use App\Enums\Screens\KeyMoveType;
use App\Support\KeyScripts\KeyMove;
use App\Support\KeyScripts\KeyScriptCatalogue;
use App\Support\KeyScripts\KeyScriptRun;
use App\Support\KeyScripts\KeyScriptRunner;
use App\Support\Screens\ScreenClassifier;
use App\Support\Screens\ScreenHolds;
use App\Support\Screens\ScreenLayout;
use App\Values\HostOrderSource;
use Tests\TestCase;

/**
 * Codex's key scripts type, on the recorded screens, exactly what the recording's user typed: the /model command, the
 * model or the reasoning level reached one drawn arrow at a time, and Enter on each picker.
 */
final class CodexKeyScriptsTest extends TestCase
{
    private const string KEY_SCRIPTS = 'codex/0.165.0/keyscripts';

    private const string BUILD = '0.165.0';

    private const int STREAM_MS = 100;

    /**
     * How many key writes the script made: one per step, and one per arrow of an entry step.
     */
    private int $sends = 0;

    public function test_choosing_a_model_types_what_the_user_typed_and_keeps_its_default_reasoning(): void
    {
        $move = $this->played('model-choice', 'ChangeModel', ['model' => 'gpt-6-luna']);

        $this->journal->assertResult(KeyMoveType::Finished, $move->type);
        $this->journal->standInHost()->assertTypedThrough(15);
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
        $this->journal->playsRecording(self::KEY_SCRIPTS."/{$recording}");
        $host = $this->journal->standInHost();
        $runner = $this->journal->service(KeyScriptRunner::class);
        $layout = $this->profile()->layout();
        $catalogue = new KeyScriptCatalogue($this->profile()->keyScripts());
        $move = KeyMove::wait(new KeyScriptRun($catalogue->scriptFor(DefaultDrivers::CODEX, self::BUILD, $script), $values));

        foreach ($host->streamTimes(self::STREAM_MS) as $time) {
            $host->clock->set($time);
            $frame = $host->frame();
            $answer = $this->answerOf($layout, $frame);

            // A screen the layout answers is passed with its recorded answer, as the terminal driver passes it.
            if ($answer !== null) {
                $host->write('process', $answer, HostOrderSource::fromJournal());

                continue;
            }

            $move = $runner->moveOn($layout, $move->run, $frame);

            if ($move->type === KeyMoveType::Send) {
                $runner->send($move, $frame, 'process', 0, HostOrderSource::fromJournal());
                $this->sends++;
            }

            if (! in_array($move->type, [KeyMoveType::Send, KeyMoveType::Wait], true)) {
                return $move;
            }
        }

        return $move;
    }

    private function answerOf(ScreenLayout $layout, HostFrameData $frame): string|null
    {
        $reading = new ScreenClassifier()->readingOf($layout, $frame);

        return $reading->isStill ? new ScreenHolds()->holdOf($reading)->answer : null;
    }

    private function profile(): DriverProfile
    {
        return $this->journal->driverProfile(DefaultDrivers::CODEX);
    }
}
