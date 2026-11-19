<?php

declare(strict_types=1);

namespace App\Skills\Handlers;

use App\Agents\Models\AgentSession;
use App\Contracts\CommandHandler;
use App\Reads\Attributes\ReadBudget;
use App\Skills\Commands\RefreshSkills;
use App\Skills\Contracts\SkillRenderer;
use App\Skills\Contracts\SkillSource;
use App\Skills\Exceptions\SkillConflict;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Models\SkillGeneration;
use App\Skills\Models\SkillPublication;
use App\Skills\Programs\ProgramSkillAdapters;
use App\Skills\Resolvers\SkillCatalogue;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Support\ConditionTree;
use App\Skills\Support\SkillRegistry;
use App\Skills\Support\SkillSelection;
use App\Skills\Support\SkillTargets;
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
        private SkillRenderer $renderer,
        private ConditionTree $conditions,
        private SkillSource $stored,
        private SkillContextResolver $contexts,
        private SkillSelection $selection,
        private SkillTargets $targets,
        private ProgramSkillAdapters $adapters,
    ) {}

    #[ReadBudget(
        queries: 13,
        models: 3_503,
        formula: 'queries: a constant 11 (stored skills in one batch of up to 1,000, sessions in one of up to 500) '
            .'+ 2 per distinct pinned profile revision (one here); models: 2 per stored skill (skill, revision) + 3 '
            .'per running session (session, agent, newest publication) + the newest generation + 2 per distinct '
            .'pinned profile revision',
    )]
    public function handle(RefreshSkills $command): RefreshResult
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
            $failed = SkillGeneration::failed($registrationDigest, $broken->getMessage());

            return new RefreshResult($failed->id, false, true, $broken->getMessage(), 0);
        }

        $entries = $catalogue->all();
        $catalogueDigest = $this->digestOf($entries);
        $previous = SkillGeneration::latestReady();
        $reused = $previous !== null && $previous->catalogue_digest === $catalogueDigest;
        $generation = $reused
            ? $previous
            : SkillGeneration::ready($catalogueDigest, $registrationDigest, $this->generationEntries($entries));

        return new RefreshResult($generation->id, $reused, false, '', $this->intendPublications($generation, $entries));
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
            if ($context->program === null || ! $this->adapters->supports($context->program)) {
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
                $context->program->key,
                $this->targets->targetFor($sessionId, $context->program),
                $selected->digest,
                $selected->selectedKeys(),
            );
        }

        return count(SkillPublication::intendMany($generation, $intents));
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
