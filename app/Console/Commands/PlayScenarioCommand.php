<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Agents\Commands\CancelSessionStart\CancelSessionStartCommand;
use App\Agents\Commands\CreateAgent\CreateAgentCommand;
use App\Agents\Commands\StopAgent\StopAgentCommand;
use App\Bus\Contracts\CommandRefusal;
use App\Bus\Contracts\OwnerCommands;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Models\Access\User;
use App\Models\Projects\Project;
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
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;
use Illuminate\Container\Attributes\Config;
use Throwable;

/**
 * Plays a scenario on this journal as the owner while recording is on, and writes its recording: the scenario is
 * refused whole before any step when it is invalid, a fact not reached in time keeps the drafts to read, and every
 * refusal of the finisher keeps the earlier recording.
 */
final class PlayScenarioCommand extends Command
{
    /**
     * Where the last failed play says why, for whoever runs the record script.
     */
    public const string LAST_FAILURE = 'storage/recordings/last-failure.txt';

    protected $signature = 'recordings:play
        {scenario : The scenario as driver/name, its file under resources/recordings/scenarios}
        {--owner= : The owner the steps run as, by email}';

    protected $description = 'Play a scenario on this journal and write its recording';

    /**
     * The profile an agent the scenario makes works under: a worker, as the scenarios' agents write code.
     */
    private const string AGENT_PROFILE = 'journal-worker';

    public function handle(
        RecordingDrafts $drafts,
        ScenarioPlayer $player,
        RecordingFinisher $finisher,
        Files $files,
        OwnerCommands $commands,
        #[Config('journal.agents.agent_image')]
        string $agentImage,
    ): int {
        $name = (string) $this->argument('scenario');
        $run = null;

        try {
            if (! $drafts->isOn()) {
                throw RecordingSwitchedOff::forScenario($name);
            }

            $file = $files->read(FilePath::in(Place::Project, Recordings::SCENARIOS."/{$name}.json"));
            $scenario = Scenario::read($name, $file);
            $owner = User::findWithEmail((string) $this->option('owner'));
            $run = new ScenarioRun($scenario, $owner, $this->agentsOf($scenario, $commands), $agentImage);

            $drafts->openRun($scenario);
            $player->play(
                $run,
                fn (ScenarioPause $pause) => $this->askUser($pause),
                fn (string $line) => $this->line($line),
            );
            $drafts->closeRun();
            $folder = $finisher->finish($drafts->run());
            $drafts->clear();
        } catch (RecordingSwitchedOff|ScenarioInvalid|ScenarioStuck|RecordingUnfinished|RecordedEnvironmentRefused
            |RecordingOutsideContainer|RecordingBreaksProtocol|RecordingLeaks|HostProtocolDrifted $refused) {
                $this->stopAgentsOf($run, $commands);
                $files->write(FilePath::in(Place::Project, self::LAST_FAILURE), $refused->getMessage()."\n");
                $this->error($refused->getMessage());

                return self::FAILURE;
            } catch (Throwable $failed) {
                // Any other failure ends the play at once: no agent of it keeps running and no half run is kept.
                $this->stopAgentsOf($run, $commands);
                $drafts->clear();
                $why = $this->failureLine($name, $run, $failed);
                $files->write(FilePath::in(Place::Project, self::LAST_FAILURE), "{$why}\n");
                $this->error($why);

                return self::FAILURE;
            }

        $this->info("Recorded {$name} into {$folder->relative}.");

        return self::SUCCESS;
    }

    /**
     * The one line that says why a play failed: the scenario, the step it was on and what was thrown there.
     */
    private function failureLine(string $name, ScenarioRun|null $run, Throwable $failed): string
    {
        $step = $run === null ? 'before its first step' : 'at step '.($run->stepIndex() + 1);

        return "The scenario {$name} failed {$step}: ".$failed::class.": {$failed->getMessage()}";
    }

    /**
     * Each agent the scenario's steps name, by its name, as this journal holds it.
     *
     * @return array<string, string>
     */
    private function agentsOf(Scenario $scenario, OwnerCommands $commands): array
    {
        $names = array_values(array_unique(array_filter(array_map(fn ($step) => $step->agent, $scenario->steps))));
        $play = CarbonImmutable::now()->format('His');
        $agents = [];

        // Each play makes its own agents, so nothing an earlier play left running can hold this one up.
        foreach ($names as $name) {
            $project = Project::findLocal()->id;
            $made = $commands->run(new CreateAgentCommand("{$name} {$play}", self::AGENT_PROFILE, $project));
            $agents[$name] = $made->id;
        }

        return $agents;
    }

    /**
     * Stops every session the failed play left running, so the next play starts its agents free.
     */
    private function stopAgentsOf(ScenarioRun|null $run, OwnerCommands $commands): void
    {
        foreach ($run?->runningAgents() ?? [] as $agent) {
            $session = (string) $agent->current_session_id;

            // A session still starting has nothing to stop yet; its start is cancelled instead.
            try {
                $commands->run(new StopAgentCommand($agent->id, $session, "scenario-cleanup-{$session}"));
            } catch (CommandRefusal) {
                $commands->run(new CancelSessionStartCommand($agent->id, $session, "scenario-cancel-{$session}"));
            }
        }
    }

    private function askUser(ScenarioPause $pause): string
    {
        $this->line($pause->text);

        if ($pause->signIn !== null) {
            $this->line("Sign in at {$pause->signIn->address}");
        }

        if ($pause->signIn?->code !== null) {
            $this->line("Enter the code {$pause->signIn->code}");
        }

        return (string) $this->ask('Type the code the page shows, or press Enter', '');
    }
}
