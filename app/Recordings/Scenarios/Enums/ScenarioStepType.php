<?php

declare(strict_types=1);

namespace App\Recordings\Scenarios\Enums;

/**
 * What one step of a scenario does, as its file names it under "do".
 */
enum ScenarioStepType: string
{
    case StartSession = 'start-session';
    case SendMessage = 'send-message';
    case Interrupt = 'interrupt';
    case Stop = 'stop';
    case ChangeModel = 'change-model';
    case ChangeEffort = 'change-effort';
    case KillAgents = 'kill-agents';
    case SignIn = 'sign-in';
    case MakeFolder = 'make-folder';
    case ReadFolderUse = 'read-folder-use';
    case RemoveFolder = 'remove-folder';
    case ProtectHost = 'protect-host';
    case ReadProject = 'read-project';
    case UpgradeHost = 'upgrade-host';
    case AllowImages = 'allow-images';
    case SubmitCode = 'submit-code';
    case AskUser = 'ask-user';
    case RemoveImage = 'remove-image';
    case StopDaemon = 'stop-daemon';
    case StartDaemon = 'start-daemon';
    case Install = 'install';
    case Update = 'update';
    case Heal = 'heal';
    case WaitFor = 'wait-for';

    /**
     * Whether a step of this type is carried out by a bus command the owner sends, as the application sends it.
     */
    public function isCommand(): bool
    {
        return in_array($this, [
            self::StartSession,
            self::SendMessage,
            self::Interrupt,
            self::Stop,
            self::ChangeModel,
            self::ChangeEffort,
            self::SignIn,
            self::SubmitCode,
            self::MakeFolder,
            self::ReadFolderUse,
            self::RemoveFolder,
            self::ProtectHost,
            self::ReadProject,
            self::UpgradeHost,
            self::AllowImages,
        ], true);
    }

    /**
     * Whether a step of this type orders this journal's host something no session orders.
     */
    public function isHostOrder(): bool
    {
        return in_array($this, [
            self::MakeFolder,
            self::ReadFolderUse,
            self::RemoveFolder,
            self::ProtectHost,
            self::ReadProject,
            self::UpgradeHost,
            self::AllowImages,
        ], true);
    }

    /**
     * Whether a step of this type changes the machine the recording runs on: an image, the agent daemon or the
     * installation, the only way a scenario arranges a refusal.
     */
    public function isMachineChange(): bool
    {
        return in_array($this, [
            self::RemoveImage,
            self::KillAgents,
            self::StopDaemon,
            self::StartDaemon,
            self::Install,
            self::Update,
            self::Heal,
        ], true);
    }

    /**
     * The fields a step of this type must name, as its file spells them.
     *
     * @return list<string>
     */
    public function requiredFields(): array
    {
        return match ($this) {
            self::StartSession => [
                'agent',
                'type',
                'model',
                'effort',
            ],
            self::SendMessage => [
                'agent',
                'text',
            ],
            self::Interrupt, self::Stop => ['agent'],
            self::ChangeModel => [
                'agent',
                'model',
            ],
            self::ChangeEffort => [
                'agent',
                'effort',
            ],
            self::SignIn => [
                'driver',
                'method',
            ],
            self::MakeFolder, self::ReadFolderUse, self::RemoveFolder => ['folder'],
            self::ReadProject => ['path'],
            self::AllowImages => ['images'],
            self::ProtectHost, self::UpgradeHost => [],
            self::SubmitCode => ['from'],
            self::AskUser => ['text'],
            self::RemoveImage => ['image'],
            self::WaitFor => [
                'fact',
                'seconds',
            ],
            self::KillAgents, self::StopDaemon, self::StartDaemon, self::Install, self::Update, self::Heal => [],
        };
    }
}
