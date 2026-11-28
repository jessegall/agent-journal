<?php

declare(strict_types=1);

namespace App\Recordings\Scenarios;

use App\Accounts\Commands\BeginSignIn\BeginSignInCommand;
use App\Accounts\Commands\SubmitSignInCode\SubmitSignInCodeCommand;
use App\Accounts\Enums\SignInMethod;
use App\Agents\Commands\ChangeAgentEffort\ChangeAgentEffortCommand;
use App\Agents\Commands\ChangeAgentModel\ChangeAgentModelCommand;
use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Commands\InterruptAgent\InterruptAgentCommand;
use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Commands\StopAgent\StopAgentCommand;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Enums\ConversationModeType;
use App\Hosts\Commands\AllowHostImages\AllowHostImagesCommand;
use App\Hosts\Commands\InstructHostUpgrade\InstructHostUpgradeCommand;
use App\Hosts\Commands\MakeHostFolder\MakeHostFolderCommand;
use App\Hosts\Commands\ReadFolderUse\ReadFolderUseCommand;
use App\Hosts\Commands\RemoveHostFolder\RemoveHostFolderCommand;
use App\Projects\Commands\RequestProjectRead\RequestProjectReadCommand;
use App\Projects\Enums\ProjectReadType;
use App\Recordings\Scenarios\Enums\ScenarioFact;
use App\Recordings\Scenarios\Enums\ScenarioStepType;
use App\Recordings\Scenarios\Exceptions\ScenarioInvalid;
use App\Sessions\Commands\ReleaseAgentHold\ReleaseAgentHoldCommand;
use App\Sessions\Enums\StartOriginType;
use App\Sessions\Values\StartPolicy;
use App\Support\Command;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use App\Values\StartRequest;
use Illuminate\Support\Str;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

/**
 * One step of a scenario as its file writes it: what it does under "do", and the fields its type names.
 */
final class ScenarioStep extends Data
{
    /**
     * Kills every running session container on the agent daemon, as a crash of the program inside it would end it.
     */
    private const string KILL_SESSION_CONTAINERS = 'docker kill $(docker ps -q --filter label=journal.session)';

    /**
     * @param  list<string>|null  $images
     */
    public function __construct(
        #[MapInputName('do')]
        public readonly ScenarioStepType $stepType,
        public readonly string|null $agent = null,
        #[MapInputName('type')]
        public readonly DriverType|null $driverType = null,
        public readonly string|null $model = null,
        public readonly string|null $effort = null,
        public readonly string|null $text = null,
        public readonly string|null $driver = null,
        public readonly string|null $method = null,
        public readonly string|null $from = null,
        public readonly string|null $image = null,
        public readonly string|null $folder = null,
        public readonly string|null $path = null,
        public readonly array|null $images = null,
        public readonly ScenarioFact|null $fact = null,
        public readonly int|null $seconds = null,
    ) {}

    /**
     * The bus command the owner sends for the step, the one the application sends for the same action: the one
     * mapping recordings:play and the test journal both use.
     *
     * @return Command<mixed>
     *
     * @throws ScenarioInvalid
     */
    public function commandFor(ScenarioRun $run, DriverCatalogue $drivers): Command
    {
        $key = $run->stepKey();

        if ($this->stepType === ScenarioStepType::SignIn) {
            return new BeginSignInCommand((string) $this->driver, SignInMethod::from((string) $this->method));
        }

        if ($this->stepType->isHostInstruction()) {
            return $this->hostInstructionFor($run, $key);
        }

        if ($this->stepType === ScenarioStepType::SubmitCode) {
            [$attempt, $code] = $run->challenge();

            return new SubmitSignInCodeCommand($attempt, $code, $key);
        }

        $agent = $run->agentNamed((string) $this->agent);

        if ($this->stepType === ScenarioStepType::StartSession) {
            $run->holdStartRequest(strtolower((string) Str::ulid()));
        }

        if ($this->stepType === ScenarioStepType::SendMessage) {
            $run->askTurn();
        }

        return match ($this->stepType) {
            ScenarioStepType::StartSession => new StartAgentCommand(new StartRequest(
                $run->startRequest(),
                $agent->id,
                SelectedDriver::resolve(
                    $run->scenario->driver(),
                    ModelSelection::named($this->startModel($run)),
                    $this->effort,
                    null,
                    null,
                    $drivers,
                ),
                StartOriginType::MainStart,
                null,
                null,
                ConversationModeType::New,
                null,
                // A recording keeps only what runs in the agent image, so every scenario starts contained.
                StartPolicy::mainInContainer($run->agentImage),
                $this->driverType ?? DriverType::Terminal,
            )),
            ScenarioStepType::SendMessage => DeliverAgentCommand::text(
                $agent->id,
                (string) $agent->current_session_id,
                $key,
                (string) $this->text,
            ),
            ScenarioStepType::Interrupt => new InterruptAgentCommand(
                $agent->id,
                (string) $agent->current_session_id,
                $key,
            ),
            // Releasing an interrupted runtime, as a user does from its hold, lets the work held behind it run.
            ScenarioStepType::ReleaseHold => new ReleaseAgentHoldCommand(
                $agent->id,
                (string) $agent->current_session_id,
                HoldReason::Interrupted,
                'the scenario goes on after its interrupt',
            ),
            ScenarioStepType::Stop => new StopAgentCommand($agent->id, (string) $agent->current_session_id, $key),
            ScenarioStepType::ChangeModel => new ChangeAgentModelCommand(
                $agent->id,
                (string) $agent->current_session_id,
                $key,
                (string) $this->model,
            ),
            ScenarioStepType::ChangeEffort => new ChangeAgentEffortCommand(
                $agent->id,
                (string) $agent->current_session_id,
                $key,
                (string) $this->effort,
            ),
            default => throw ScenarioInvalid::at(
                $run->scenario->name,
                $run->stepIndex(),
                "({$this->stepType->value}) is no command step",
            ),
        };
    }

    /**
     * The model a start-session step names, which its file must.
     *
     * @throws ScenarioInvalid
     */
    private function startModel(ScenarioRun $run): string
    {
        $missing = '(start-session) names no model';

        return $this->model ?? throw ScenarioInvalid::at($run->scenario->name, $run->stepIndex(), $missing);
    }

    /**
     * The command of a step that instructs this journal's host something no session instructions: a folder made, read for its
     * use or removed, a protected start, a project read, an upgrade or images allowed.
     *
     * @return Command<mixed>
     *
     * @throws ScenarioInvalid
     */
    private function hostInstructionFor(ScenarioRun $run, string $key): Command
    {
        $host = $run->hostId();

        return match ($this->stepType) {
            ScenarioStepType::MakeFolder => new MakeHostFolderCommand($host, (string) $this->folder, $key),
            ScenarioStepType::ReadFolderUse => new ReadFolderUseCommand($host, (string) $this->folder, $key),
            ScenarioStepType::RemoveFolder => new RemoveHostFolderCommand($host, (string) $this->folder, $key),
            ScenarioStepType::ReadProject => new RequestProjectReadCommand(
                $run->bindingIdOn($host),
                ProjectReadType::Directory,
                [(string) $this->path],
            ),
            ScenarioStepType::UpgradeHost => new InstructHostUpgradeCommand($host),
            default => new AllowHostImagesCommand($host, array_map($run->imageNamed(...), $this->images ?? [])),
        };
    }

    /**
     * The step in a few words, for whoever watches a play: what it does and to whom or what.
     */
    public function summary(): string
    {
        $parts = [
            $this->stepType->value,
            $this->agent,
            $this->model,
            $this->effort,
            $this->fact?->value,
            $this->text === null ? null : '"'.mb_strimwidth($this->text, 0, 60, '…').'"',
        ];

        return implode(' ', array_filter($parts, fn (string|null $part) => $part !== null));
    }

    /**
     * The pause of an ask-user step: its words and the sign-in link the run's challenge showed.
     */
    public function pause(string|null $signInLink): ScenarioPause
    {
        return new ScenarioPause((string) $this->text, $signInLink);
    }

    /**
     * The program line that changes the machine for the step, which the record script runs on the machine from the
     * checkout's root, as the journal's container holds no Docker: an image removed from the agent daemon, the
     * daemon stopped or started, or the installation made, updated or healed.
     *
     * @return list<string>
     *
     * @throws ScenarioInvalid
     */
    public function machineChange(ScenarioRun $run): array
    {
        $image = $run->imageNamed((string) $this->image);

        $compose = [
            'docker',
            'compose',
        ];

        return match ($this->stepType) {
            ScenarioStepType::RemoveImage => [
                ...$compose,
                'exec',
                '-T',
                'agent-docker',
                'docker',
                'rmi',
                '--force',
                $image,
            ],
            ScenarioStepType::KillAgents => [
                ...$compose,
                'exec',
                '-T',
                'agent-docker',
                'sh',
                '-c',
                self::KILL_SESSION_CONTAINERS,
            ],
            ScenarioStepType::StopDaemon => [
                ...$compose,
                'stop',
                'agent-docker',
            ],
            ScenarioStepType::StartDaemon => [
                ...$compose,
                'start',
                'agent-docker',
            ],
            ScenarioStepType::Install => [
                'sh',
                'scripts/local-host.sh',
                '--fresh',
            ],
            ScenarioStepType::Update, ScenarioStepType::Heal => [
                'sh',
                'scripts/local-host.sh',
            ],
            default => throw ScenarioInvalid::at(
                $run->scenario->name,
                $run->stepIndex(),
                "({$this->stepType->value}) changes nothing of the machine",
            ),
        };
    }
}
