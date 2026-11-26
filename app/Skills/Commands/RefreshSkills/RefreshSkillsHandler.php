<?php

declare(strict_types=1);

namespace App\Skills\Commands\RefreshSkills;

use App\Bus\Contracts\CommandHandler;
use App\Models\Skills\SkillGeneration;
use App\Skills\CanonicalRenderer;
use App\Skills\ConditionTree;
use App\Skills\Data\GeneratedSkillData;
use App\Skills\Enums\GenerationStatus;
use App\Skills\Exceptions\SkillConflict;
use App\Skills\Exceptions\SkillDeclarationInvalid;
use App\Skills\Resolvers\SkillCatalogue;
use App\Skills\SkillRegistry;
use App\Skills\StoredSkillSource;
use App\Skills\Values\RefreshResult;
use App\Skills\Values\SkillEntry;
use Illuminate\Contracts\Container\Container;

final readonly class RefreshSkillsHandler implements CommandHandler
{
    public function __construct(
        private SkillRegistry $registry,
        private Container $container,
        private CanonicalRenderer $renderer,
        private ConditionTree $conditions,
        private StoredSkillSource $stored,
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

            return new RefreshResult($failed->id, false, true, $broken->getMessage());
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

        return new RefreshResult($generation->id, $reused, false, '');
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
