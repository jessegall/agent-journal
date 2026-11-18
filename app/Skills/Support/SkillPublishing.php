<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Actors\Support\ActorStore;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Skills\Commands\ActivateSkillPublication;
use App\Skills\Commands\FailSkillPublication;
use App\Skills\Commands\PrepareSkillPublication;
use App\Skills\Commands\PublishSkills;
use App\Skills\Enums\PublicationState;
use App\Skills\Exceptions\SkillPublicationFailed;
use App\Skills\Exceptions\SkillPublicationStale;
use App\Skills\Models\SkillPublication;

/**
 * The supervisor's side of publishing, as the journal itself: it claims each committed open publication and runs its
 * steps as separate bus commands, so no step publishes uncommitted intent. A failed step is recorded in a new command
 * after it rolled back; a worker that lost its fence stops and reports superseded.
 */
final readonly class SkillPublishing
{
    private const int MOST_PUBLICATIONS = 100;

    public function __construct(
        private CommandBus $commands,
        private ActorStore $actors,
    ) {}

    /**
     * Publishes every committed open publication, oldest first; answers each one's outcome by publication id.
     *
     * @return array<string, PublicationState>
     */
    public function publishOpen(string $holder): array
    {
        $outcomes = [];

        foreach (SkillPublication::open(self::MOST_PUBLICATIONS) as $publication) {
            $outcomes[$publication->id] = $this->publish($publication->id, $holder);
        }

        return $outcomes;
    }

    public function publish(string $publicationId, string $holder): PublicationState
    {
        try {
            $claim = $this->asSystem(new PublishSkills($publicationId, $holder));
        } catch (SkillPublicationFailed) {
            return SkillPublication::query()->whereKey($publicationId)->firstOrFail()->state;
        }

        try {
            do {
                $progress = $this->asSystem(new PrepareSkillPublication($publicationId, $claim->fence));
            } while (! $progress->isComplete());

            $this->asSystem(new ActivateSkillPublication($publicationId, $claim->fence));

            return PublicationState::Delivered;
        } catch (SkillPublicationStale) {
            return PublicationState::Superseded;
        } catch (SkillPublicationFailed $failure) {
            $this->asSystem(new FailSkillPublication($publicationId, $failure->getMessage()));

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
        return $this->actors->actAsSystem(fn () => $this->commands->run($command));
    }
}
