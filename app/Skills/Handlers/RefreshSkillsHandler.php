<?php

declare(strict_types=1);

namespace App\Skills\Handlers;

use App\Agents\Models\AgentSession;
use App\Contracts\CommandHandler;
use App\Skills\Commands\RefreshSkills;
use App\Skills\Contracts\SkillRenderer;
use App\Skills\Contracts\SkillSource;
use App\Skills\Exceptions\SkillConditionInvalid;
use App\Skills\Exceptions\SkillConflict;
use App\Skills\Exceptions\SkillContextUnavailable;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Exceptions\SkillKeyInvalid;
use App\Skills\Exceptions\SkillSelectionConflict;
use App\Skills\Exceptions\SkillSourceInvalid;
use App\Skills\Models\SkillGeneration;
use App\Skills\Models\SkillPublication;
use App\Skills\Readers\SkillCatalogue;
use App\Skills\Readers\SkillContextReader;
use App\Skills\Support\ConditionTree;
use App\Skills\Support\SkillRegistry;
use App\Skills\Support\SkillSelection;
use App\Skills\Support\SkillTargets;
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
        private SkillContextReader $contexts,
        private SkillSelection $selection,
        private SkillTargets $targets,
    ) {}

    public function handle(RefreshSkills $command): RefreshResult
    {
        $registrationDigest = $this->registry->digest();

        try {
            $catalogue = SkillCatalogue::build($this->registry, $this->container, $this->renderer, $this->conditions, $this->stored);
        } catch (SkillDeclarationInvalid|SkillSourceInvalid|SkillConflict|SkillConditionInvalid|SkillKeyInvalid $broken) {
            $failed = SkillGeneration::failed($registrationDigest, $broken->getMessage());

            return new RefreshResult($failed->id, false, true, $broken->getMessage(), 0);
        }

        $entries = $catalogue->all();
        $catalogueDigest = $this->digestOf($entries);
        $previous = SkillGeneration::latestReady();
        $reused = $previous !== null && $previous->catalogue_digest === $catalogueDigest;
        $generation = $reused ? $previous : SkillGeneration::ready($catalogueDigest, $registrationDigest, $this->generationEntries($entries));

        return new RefreshResult($generation->id, $reused, false, '', $this->intendPublications($generation, $entries));
    }

    /**
     * One pending publication for each running session whose selection changed since its last publication.
     *
     * @param  list<SkillEntry>  $entries
     */
    private function intendPublications(SkillGeneration $generation, array $entries): int
    {
        $intended = 0;

        foreach (AgentSession::runningForMaintenance(self::MOST_SESSIONS) as $session) {
            try {
                $context = $this->contexts->forSession($session);
                $selected = $this->selection->select($entries, $context);
            } catch (SkillContextUnavailable|SkillSelectionConflict) {
                continue;
            }

            if ($context->program === null) {
                continue;
            }

            $target = $this->targets->targetFor($session->id, $context->program);

            if (SkillPublication::hasSelection($session->id, $target, $selected->digest)) {
                continue;
            }

            SkillPublication::intend($session->id, $context->program->key, $target, $generation, $selected->digest);
            $intended++;
        }

        return $intended;
    }

    /**
     * @param  list<SkillEntry>  $entries
     */
    private function digestOf(array $entries): string
    {
        return hash('sha256', (string) json_encode(array_map(fn (SkillEntry $entry) => [$entry->key->key, $entry->owner, $entry->revision, $entry->rendered->digest, $entry->condition->toArray()], $entries), JSON_THROW_ON_ERROR));
    }

    /**
     * @param  list<SkillEntry>  $entries
     * @return list<array{key: string, owner: string, revision: int|null, markdown: string, digest: string}>
     */
    private function generationEntries(array $entries): array
    {
        return array_map(fn (SkillEntry $entry) => ['key' => $entry->key->key, 'owner' => $entry->owner, 'revision' => $entry->revision, 'markdown' => $entry->rendered->markdown, 'digest' => $entry->rendered->digest], $entries);
    }
}
