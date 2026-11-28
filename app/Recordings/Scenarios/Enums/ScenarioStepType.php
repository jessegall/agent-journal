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
    // Home's New chat: a new main agent on the scenario's driver and the model named, kept under the agent's name.
    case NewChat = 'new-chat';
    // The chat's send: the agent is started on its kept choice when it runs no session, then the message is posted.
    case SendChatMessage = 'send-chat-message';
    case Interrupt = 'interrupt';
    case ReleaseHold = 'release-hold';
    case Stop = 'stop';
    case ChangeModel = 'change-model';
    case ChangeEffort = 'change-effort';
    case KillAgents = 'kill-agents';
    case SignIn = 'sign-in';
    case ConnectProject = 'connect-project';
    case MakeFolder = 'make-folder';
    case ReadFolderUse = 'read-folder-use';
    case RemoveFolder = 'remove-folder';
    case ReadProject = 'read-project';
    case UpgradeHost = 'upgrade-host';
    case AllowImages = 'allow-images';
    case SubmitCode = 'submit-code';
    case AskUser = 'ask-user';
    case SendKeys = 'send-keys';
    case RemoveImage = 'remove-image';
    case StopDaemon = 'stop-daemon';
    case StartDaemon = 'start-daemon';
    case Install = 'install';
    case Update = 'update';
    case Heal = 'heal';
    case WaitFor = 'wait-for';
    case RestartHost = 'restart-host';

    /**
     * Whether a step of this type is carried out by a bus command the owner sends, as the application sends it.
     */
    public function isCommand(): bool
    {
        return in_array($this, [
            self::StartSession,
            self::SendMessage,
            self::NewChat,
            self::Interrupt,
            self::ReleaseHold,
            self::Stop,
            self::ChangeModel,
            self::ChangeEffort,
            self::SignIn,
            self::ConnectProject,
            self::SubmitCode,
            self::MakeFolder,
            self::ReadFolderUse,
            self::RemoveFolder,
            self::ReadProject,
            self::UpgradeHost,
            self::AllowImages,
        ], true);
    }

    /**
     * Whether a step of this type instructions this journal's host something no session instructions.
     */
    public function isHostInstruction(): bool
    {
        return in_array($this, [
            self::MakeFolder,
            self::ReadFolderUse,
            self::RemoveFolder,
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
            self::SendMessage, self::SendChatMessage, self::SendKeys => [
                'agent',
                'text',
            ],
            self::NewChat => [
                'agent',
                'model',
            ],
            self::Interrupt, self::ReleaseHold, self::Stop => ['agent'],
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
            self::ConnectProject, self::UpgradeHost => [],
            self::SubmitCode => ['from'],
            self::AskUser => ['text'],
            self::RemoveImage => ['image'],
            self::WaitFor => [
                'fact',
                'seconds',
            ],
            self::KillAgents, self::StopDaemon, self::StartDaemon, self::Install, self::Update, self::Heal,
            self::RestartHost => [],
        };
    }
}
