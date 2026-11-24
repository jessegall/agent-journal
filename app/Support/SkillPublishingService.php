<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\ActivateSkillPublication\ActivateSkillPublicationCommand;
use App\Commands\FailSkillPublication\FailSkillPublicationCommand;
use App\Commands\PrepareSkillPublication\PrepareSkillPublicationCommand;
use App\Commands\PruneSkillPublications\PruneSkillPublicationsCommand;
use App\Commands\PublishSkills\PublishSkillsCommand;
use App\Commands\RefreshSkills\RefreshSkillsCommand;
use App\Commands\RetrySkillPublication\RetrySkillPublicationCommand;
use App\Contracts\Bus\Command;
use App\Enums\CommandEntry;
use App\Enums\PublicationState;
use App\Exceptions\SkillPublicationFailed;
use App\Exceptions\SkillPublicationStale;
use App\Models\Skills\SkillPublication;
use App\Values\PrunedPublications;
use App\Values\RefreshResult;

/**
 * The supervisor's side of publishing, as the journal itself: it claims each committed open publication and runs its
 * steps as separate bus commands, so no step publishes uncommitted intent. A failed step is recorded in a new command
 * after it rolled back; a worker that lost its fence stops and reports superseded.
 */
final readonly class SkillPublishingService
{
    private const int PUBLICATION_LIMIT = 100;

    public function __construct(
        private EntryDispatchers $dispatchers,
    ) {}

    /**
     * Checks and renders the catalogue as the journal; the publications it asks for wait for publishOpen.
     */
    public function refresh(): RefreshResult
    {
        return $this->asSystem(new RefreshSkillsCommand());
    }

    /**
     * Puts a failed publication back in the queue and publishes it at once.
     */
    public function retry(string $publicationId, string $holder): PublicationState
    {
        $this->asSystem(new RetrySkillPublicationCommand($publicationId));

        return $this->publish($publicationId, $holder);
    }

    public function prune(): PrunedPublications
    {
        return $this->asSystem(new PruneSkillPublicationsCommand());
    }

    /**
     * Publishes every committed open publication, oldest first; answers each one's outcome by publication id.
     *
     * @return array<string, PublicationState>
     */
    public function publishOpen(string $holder): array
    {
        $outcomes = [];

        foreach (SkillPublication::open(self::PUBLICATION_LIMIT) as $publication) {
            $outcomes[$publication->id] = $this->publish($publication->id, $holder);
        }

        return $outcomes;
    }

    public function publish(string $publicationId, string $holder): PublicationState
    {
        try {
            $claim = $this->asSystem(new PublishSkillsCommand($publicationId, $holder));
        } catch (SkillPublicationFailed) {
            return SkillPublication::query()->whereKey($publicationId)->firstOrFail()->state;
        }

        try {
            do {
                $progress = $this->asSystem(new PrepareSkillPublicationCommand($publicationId, $claim->fence));
            } while (! $progress->isComplete());

            $this->asSystem(new ActivateSkillPublicationCommand($publicationId, $claim->fence));

            return PublicationState::Delivered;
        } catch (SkillPublicationStale) {
            return PublicationState::Superseded;
        } catch (SkillPublicationFailed $failure) {
            $this->asSystem(new FailSkillPublicationCommand($publicationId, $failure->getMessage()));

            return PublicationState::Failed;
        }
    }

    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asSystem(Command $command): mixed
    {
        return $this->dispatchers->runAsJournal(CommandEntry::SkillPublisher, 'skill publishing', $command);
    }
}
