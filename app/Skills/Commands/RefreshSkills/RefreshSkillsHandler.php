<?php

declare(strict_types=1);

namespace App\Skills\Commands\RefreshSkills;

use App\Agents\Models\AgentSession;
use App\Contracts\CommandHandler;
use App\Skills\Drivers\DriverSkillAdapters;
use App\Skills\Enums\GenerationState;
use App\Skills\Exceptions\SkillConflict;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Models\SkillGeneration;
use App\Skills\Models\SkillPublication;
use App\Skills\Resolvers\SkillCatalogue;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Support\CanonicalRenderer;
use App\Skills\Support\ConditionTree;
use App\Skills\Support\SkillPublications;
use App\Skills\Support\SkillRegistry;
use App\Skills\Support\SkillSelection;
use App\Skills\Support\SkillTargets;
use App\Skills\Support\StoredSkillSource;
use App\Skills\Values\PublicationIntent;
use App\Skills\Values\RefreshResult;
use App\Skills\Values\SkillEntry;
use Illuminate\Contracts\Container\Container;

final readonly class RefreshSkillsHandler implements CommandHandler
{
    private const int MOST_SESSIONS = 500;

    public function __construct(
        private SkillRegistry $registry,
        private Container $container,
        private CanonicalRenderer $renderer,
        private ConditionTree $conditions,
        private StoredSkillSource $stored,
        private SkillContextResolver $contexts,
        private SkillSelection $selection,
        private SkillTargets $targets,
        private DriverSkillAdapters $adapters,
        private SkillPublications $publications,
    ) {}

    public function handle(RefreshSkillsCommand $command): RefreshResult
    {
        $registrationDigest = $this->registry->digest();

        try {
            $catalogue = SkillCatalogue::build(
                $this->registry,
                $this->container,
                $this->renderer,
                $this->conditions,
                $this->stored,
            );
        } catch (SkillDeclarationInvalid|SkillConflict $broken) {
            $failed = SkillGeneration::create(
                $registrationDigest,
                GenerationState::Failed,
                '',
                [],
                $broken->getMessage(),
            );

            return new RefreshResult($failed->id, false, true, $broken->getMessage(), 0);
        }

        $skillEntries = $catalogue->all();
        $catalogueDigest = $this->digestOf($skillEntries);
        $previous = SkillGeneration::latestReady();
        $reused = $previous !== null && $previous->catalogue_digest === $catalogueDigest;

        $generation = $reused
            ? $previous
            : SkillGeneration::create(
                $registrationDigest,
                GenerationState::Ready,
                $catalogueDigest,
                $this->generationEntries($skillEntries),
                null,
            );

        return new RefreshResult(
            $generation->id,
            $reused,
            false,
            '',
            $this->intendPublications($generation, $skillEntries),
        );
    }

    /**
     * One pending publication for each running session whose selection changed since its last publication.
     *
     * @param  list<SkillEntry>  $entries
     */
    private function intendPublications(SkillGeneration $generation, array $entries): int
    {
        $intents = [];
        $contexts = $this->contexts->forSessions(AgentSession::runningForMaintenance(self::MOST_SESSIONS));
        $current = SkillPublication::currentSelectionsOf(array_keys($contexts));

        foreach ($contexts as $sessionId => $context) {
            if ($context->driver === null || ! $this->adapters->supports($context->driver)) {
                continue;
            }

            try {
                $selected = $this->selection->select($entries, $context);
            } catch (SkillSelectionConflict) {
                continue;
            }

            if (($current[$sessionId] ?? null) === $selected->digest) {
                continue;
            }

            $intents[] = new PublicationIntent(
                $sessionId,
                $context->driver->key,
                $this->targets->targetFor($sessionId, $context->driver),
                $selected->digest,
                $selected->selectedKeys(),
            );
        }

        return count($this->publications->intendMany($generation, $intents));
    }

    /**
     * @param  list<SkillEntry>  $entries
     */
    private function digestOf(array $entries): string
    {
        $identities = array_map(fn (SkillEntry $entry) => [
            $entry->key->key,
            $entry->owner,
            $entry->revision,
            $entry->rendered->digest,
            $entry->condition->toArray(),
        ], $entries);

        return hash('sha256', json_encode($identities, JSON_THROW_ON_ERROR));
    }

    /**
     * @param  list<SkillEntry>  $entries
     * @return list<array{key: string, owner: string, revision: int|null, markdown: string, digest: string}>
     */
    private function generationEntries(array $entries): array
    {
        return array_map(fn (SkillEntry $entry) => [
            'key' => $entry->key->key,
            'owner' => $entry->owner,
            'revision' => $entry->revision,
            'markdown' => $entry->rendered->markdown,
            'digest' => $entry->rendered->digest,
        ], $entries);
    }
}
