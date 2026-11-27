<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Recordings\Exceptions\HostProtocolDrifted;
use App\Recordings\Exceptions\RecordedEnvironmentRefused;
use App\Recordings\Exceptions\RecordingBreaksProtocol;
use App\Recordings\Exceptions\RecordingLeaks;
use App\Recordings\Exceptions\RecordingOutsideContainer;
use App\Recordings\Exceptions\RecordingSwitchedOff;
use App\Recordings\Exceptions\RecordingUnfinished;
use App\Recordings\RecordingDrafts;
use App\Recordings\RecordingFinisher;
use App\Recordings\Recordings;
use App\Recordings\Scenarios\Exceptions\ScenarioInvalid;
use App\Recordings\Scenarios\Exceptions\ScenarioStuck;
use App\Recordings\Scenarios\Scenario;
use App\Recordings\Scenarios\ScenarioPause;
use App\Recordings\Scenarios\ScenarioPlayer;
use App\Recordings\Scenarios\ScenarioRun;
use App\Values\FilePath;
use Illuminate\Console\Command;
use Illuminate\Container\Attributes\Config;

/**
 * Plays a scenario on this journal as the owner while recording is on, and writes its recording: the scenario is
 * refused whole before any step when it is invalid, a fact not reached in time keeps the drafts to read, and every
 * refusal of the finisher keeps the earlier recording.
 */
final class PlayScenarioCommand extends Command
{
    protected $signature = 'recordings:play
        {scenario : The scenario as driver/name, its file under resources/recordings/scenarios}
        {--owner= : The owner the steps run as, by email}';

    protected $description = 'Play a scenario on this journal and write its recording';

    public function handle(
        RecordingDrafts $drafts,
        ScenarioPlayer $player,
        RecordingFinisher $finisher,
        Files $files,
        #[Config('agents.agent_image')]
        string $agentImage,
    ): int {
        $name = (string) $this->argument('scenario');

        try {
            if (! $drafts->isOn()) {
                throw RecordingSwitchedOff::forScenario($name);
            }

            $file = $files->read(FilePath::in(Place::Project, Recordings::SCENARIOS."/{$name}.json"));
            $scenario = Scenario::read($name, $file);
            $owner = User::findWithEmail((string) $this->option('owner'));
            $run = new ScenarioRun($scenario, $owner, $this->agentsOf($scenario), $agentImage);

            $drafts->openRun($scenario);
            $player->play($run, fn (ScenarioPause $pause) => $this->askUser($pause));
            $drafts->closeRun();
            $folder = $finisher->finish($drafts->run());
            $drafts->clear();
        } catch (RecordingSwitchedOff|ScenarioInvalid|ScenarioStuck|RecordingUnfinished|RecordedEnvironmentRefused
            |RecordingOutsideContainer|RecordingBreaksProtocol|RecordingLeaks|HostProtocolDrifted $refused) {
                $this->error($refused->getMessage());

                return self::FAILURE;
            }

        $this->info("Recorded {$name} into {$folder->relative}.");

        return self::SUCCESS;
    }

    /**
     * Each agent the scenario's steps name, by its name, as this journal holds it.
     *
     * @return array<string, string>
     */
    private function agentsOf(Scenario $scenario): array
    {
        $names = array_values(array_unique(array_filter(array_map(fn ($step) => $step->agent, $scenario->steps))));

        return Agent::query()->unretired()->whereIn('name', $names)->pluck('id', 'name')->all();
    }

    private function askUser(ScenarioPause $pause): string
    {
        $this->line($pause->text);

        if ($pause->signInLink !== null) {
            $this->line("Sign in at {$pause->signInLink}");
        }

        return (string) $this->ask('Type the code the page shows, or press Enter', '');
    }
}
