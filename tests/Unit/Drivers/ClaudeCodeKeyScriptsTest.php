<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Enums\Navigation\NavigationReason;
use App\Enums\Screens\KeyMoveType;
use App\Support\Drivers\Profiles\ClaudeCodeProfile;
use App\Support\KeyScripts\KeyMove;
use App\Support\KeyScripts\KeyScriptCatalogue;
use App\Support\KeyScripts\KeyScriptRun;
use App\Support\KeyScripts\KeyScriptRunner;
use App\Values\HostOrderSource;
use Tests\TestCase;

/**
 * Claude Code's key scripts type, on the recorded screens, exactly what the recording's user typed: a key only once
 * its screen is read, an entry reached from the highlight one drawn arrow at a time, and no key on a screen the
 * script cannot be certain of.
 */
final class ClaudeCodeKeyScriptsTest extends TestCase
{
    private const string KEY_SCRIPTS = 'claude-code/2.1.323/keyscripts';

    private const string BUILD = '2.1.323';

    private const int STREAM_MS = 100;

    /**
     * How many key writes the script made: one per step, and one per arrow of an entry step.
     */
    private int $sends = 0;

    public function test_choosing_a_model_types_what_the_user_typed_through_the_session_only_key(): void
    {
        $move = $this->played('model-choice', 'ChangeModel', ['model' => 'Haiku 5.5']);

        $this->journal->assertResult([KeyMoveType::Finished, 7], [$move->type, $this->sends]);
        $this->journal->standInHost()->assertTypedThrough(11);
    }

    public function test_choosing_an_effort_moves_the_slider_to_it_and_sets_it_for_this_session_only(): void
    {
        $move = $this->played('effort-change', 'ChangeEffort', ['effort' => 'low']);

        $this->journal->assertResult([KeyMoveType::Finished, 4], [$move->type, $this->sends]);
    }

    public function test_a_model_the_picker_does_not_show_stops_for_navigation_with_no_arrow_and_no_enter(): void
    {
        $move = $this->played('model-choice', 'ChangeModel', ['model' => 'Gemini 9']);

        $this->journal->assertResult(
            [KeyMoveType::Uncertain, NavigationReason::LabelMissing],
            [$move->type, $move->reason],
        );
        $this->journal->standInHost()->assertTypedThrough(6);
    }

    public function test_a_build_with_no_script_of_its_own_runs_the_newest_older_builds(): void
    {
        $catalogue = new KeyScriptCatalogue($this->profile()->keyScripts());

        $this->journal->assertResult(
            self::BUILD,
            $catalogue->scriptFor('claude-code', '2.1.330', 'ChangeModel')->build,
        );
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
        $move = KeyMove::wait(new KeyScriptRun($catalogue->scriptFor('claude-code', self::BUILD, $script), $values));

        foreach ($host->streamTimes(self::STREAM_MS) as $time) {
            $host->clock->set($time);
            $frame = $host->frame();
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

    private function profile(): ClaudeCodeProfile
    {
        return $this->journal->service(ClaudeCodeProfile::class);
    }
}
