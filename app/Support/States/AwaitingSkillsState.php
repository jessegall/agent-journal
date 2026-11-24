<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Attributes\StateType;
use App\Enums\FrameReuse;
use App\Enums\PublicationState;
use App\Enums\SessionTransferType;
use App\Events\Skills\SkillPublicationMoved;
use App\Support\Decisions\Decision;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\States\Support\AwaitingSkillsStateReference;
use App\Values\AgentText;
use App\Values\RecoveryCall;
use App\Values\StackVerdict;
use PhpOption\Option;
use PhpOption\Some;

/**
 * A session whose new skill set is not delivered yet: it may read, including skill:status and skill:show, but changes
 * no file until the set is delivered. It ends by itself once the publication settles.
 */
#[StateType(AwaitingSkillsStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::SessionOnly)]
final class AwaitingSkillsState extends AgentState
{
    private PublicationState $publication = PublicationState::Pending;

    public function __construct(private readonly string $publicationId) {}

    public function frameReuse(): FrameReuse
    {
        return FrameReuse::PerType;
    }

    public function isFinished(): bool
    {
        return ! $this->publication->awaitsDelivery();
    }

    public function workPermission(): StackVerdict
    {
        return StackVerdict::refuse($this->reason(), new RecoveryCall('overview_read'));
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        return new Some($this->reason());
    }

    // ----------[ Hooks ]----------

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if ($input->command->readsOnly()) {
            return Decision::delegate();
        }

        return Decision::deny($this->reason());
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return Decision::deny($this->reason());
    }

    // ----------[ Events ]----------

    public function onSkillPublicationMoved(SkillPublicationMoved $event): void
    {
        if ($event->publicationId === $this->publicationId) {
            $this->publication = $event->state;
        }
    }

    // ----------[ Internals ]----------

    private function reason(): AgentText
    {
        return AgentText::of('core.skills.not_delivered', ['state' => $this->publication->value]);
    }
}
