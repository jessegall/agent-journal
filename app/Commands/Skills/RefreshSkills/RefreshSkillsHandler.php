<?php

declare(strict_types=1);

namespace App\Commands\Skills\RefreshSkills;

use App\Agents\Drivers\Skills\DriverSkillAdapters;
use App\Contracts\Bus\CommandHandler;
use App\Data\Skills\GeneratedSkillData;
use App\Enums\Skills\GenerationStatus;
use App\Exceptions\SkillConflict;
use App\Exceptions\SkillDeclarationInvalid;
use App\Exceptions\SkillSelectionConflict;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillPublication;
use App\Resolvers\SkillCatalogue;
use App\Resolvers\Support\SkillContextResolver;
use App\Support\CanonicalRenderer;
use App\Support\ConditionTree;
use App\Support\SkillPublications;
use App\Support\SkillRegistry;
use App\Support\SkillSelection;
use App\Support\SkillTargets;
use App\Support\StoredSkillSource;
use App\Values\PublicationIntent;
use App\Values\RefreshResult;
use App\Values\SkillEntry;
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
                GenerationStatus::Failed,
                '',
                [],
                $broken->getMessage(),
            );

            return new RefreshResult($failed->id, false, true, $broken->getMessage(), 0);
        }

        $skillEntries = $catalogue->all();
        $catalogueDigest = $this->digestOf($skillEntries);
        $previous = SkillGeneration::findLatestReady();
        $reused = $previous !== null && $previous->catalogue_digest === $catalogueDigest;

        $generation = $reused
            ? $previous
            : SkillGeneration::create(
                $registrationDigest,
                GenerationStatus::Ready,
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
        $contexts = $this->contexts->forSessions(AgentSession::findRunningForMaintenance(self::MOST_SESSIONS));
        $current = SkillPublication::resolveCurrentSelectionsOf(array_keys($contexts));

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
     * @return list<GeneratedSkillData>
     */
    private function generationEntries(array $entries): array
    {
        return array_map(fn (SkillEntry $entry) => GeneratedSkillData::from([
            'key' => $entry->key->key,
            'owner' => $entry->owner,
            'revision' => $entry->revision,
            'markdown' => $entry->rendered->markdown,
            'digest' => $entry->rendered->digest,
        ]), $entries);
    }
}
