<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Attributes\States\StateType;
use App\Contracts\Events\Event;
use App\Contracts\Skills\SkillPublicationEvent;
use App\Enums\Engine\FrameReuse;
use App\Enums\Sessions\SessionTransferType;
use App\Enums\Skills\PublicationStatus;
use App\Events\Skills\SkillPublicationMoved;
use App\Support\Decisions\Decision;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\States\Support\AwaitSkillsStateReference;
use App\Values\AgentText;
use PhpOption\Option;
use PhpOption\Some;

/**
 * A session whose new skill set is not delivered yet: it may read, including skill:status and skill:show, but changes
 * no file until the set is delivered. It ends by itself once the publication settles.
 */
#[StateType(AwaitSkillsStateReference::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::SessionOnly)]
final class AwaitSkillsState extends AgentState
{
    private PublicationStatus $publication = PublicationStatus::Pending;

    public function __construct(private readonly string $publicationId) {}

    public function frameReuse(): FrameReuse
    {
        return FrameReuse::PerType;
    }

    public function isFinished(): bool
    {
        return ! $this->publication->awaitsDelivery();
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        return new Some($this->reason());
    }

    public function hears(Event $event): bool
    {
        return ! $event instanceof SkillPublicationEvent || $event->publicationId === $this->publicationId;
    }

    // ----------[ Hooks ]----------

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if ($input->isReadOnly()) {
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
        $this->publication = $event->state;
    }

    // ----------[ Internals ]----------

    private function reason(): AgentText
    {
        return AgentText::of('core.skills.not_delivered', ['state' => $this->publication->value]);
    }
}
