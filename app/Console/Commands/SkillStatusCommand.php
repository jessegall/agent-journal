<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Exceptions\ConsoleOwnerMissing;
use App\Exceptions\SkillSessionHidden;
use App\Resolvers\Support\SkillStatusResolver;
use App\Skills\SkillAuthoringService;
use App\Skills\Values\GenerationReport;
use App\Skills\Values\HandedSkillsReport;
use App\Values\SessionSkillStatus;
use App\Values\SkillStatus;
use Illuminate\Console\Command;

/**
 * Shows the journal's owner what skills each session was handed: the newest generation, each session's generation and
 * keys, and for one session every skill with its selection and whether it changed since the start.
 */
final class SkillStatusCommand extends Command
{
    protected $signature = 'skill:status
        {--session= : Only this session}
        {--json : Print the status as JSON}';

    protected $description = 'Show the skill generation and the skills each session was handed';

    public function handle(SkillAuthoringService $authoring, SkillStatusResolver $statuses): int
    {
        try {
            $authoring->actAsOwner();
        } catch (ConsoleOwnerMissing $refusal) {
            $this->error($refusal->getMessage());

            return self::FAILURE;
        }

        $resolver = $statuses;
        $session = $this->option('session');

        try {
            $status = is_string($session) ? $resolver->statusOfSession($session) : $resolver->status();
            $skills = is_string($session) ? $resolver->skillsOfSession($session) : [];
        } catch (SkillSessionHidden $hidden) {
            $this->error($hidden->getMessage());

            return self::FAILURE;
        }

        if ($this->option('json')) {
            $this->line(json_encode(
                [...$status->jsonSerialize(), 'skills' => $skills],
                JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES,
            ));

            return self::SUCCESS;
        }

        $this->printStatus($status);
        $this->printSkills($skills);

        return self::SUCCESS;
    }

    /**
     * @param  list<SessionSkillStatus>  $skills
     */
    private function printSkills(array $skills): void
    {
        if ($skills === []) {
            return;
        }

        $this->table(
            ['Skill', 'Stored revision', 'Generated', 'Selected', 'Handed', 'Changed since start', 'Last read', 'Still to read'],
            array_map(fn (SessionSkillStatus $skill) => [
                $skill->key,
                $skill->storedRevision === null ? 'shipped' : (string) $skill->storedRevision,
                $skill->generatedDigest === null ? 'not generated' : substr($skill->generatedDigest, 0, 12),
                $skill->isSelected ? 'yes' : "no: {$skill->selectionReason}",
                $skill->handedText(),
                $skill->hasChanged ? 'yes' : 'no',
                $skill->lastReadText(),
                $skill->isStillToRead ? 'yes' : 'no',
            ], $skills),
        );
    }

    private function printStatus(SkillStatus $status): void
    {
        $this->printGeneration($status->generation);

        if ($status->sessions === []) {
            $this->line('No session to show.');

            return;
        }

        $this->table(
            ['Session', 'Generation', 'Handed skills'],
            array_map(fn (HandedSkillsReport $handed) => [
                $handed->sessionId,
                $handed->generationId ?? 'none',
                $handed->skillKeys === [] ? 'none' : implode(', ', $handed->skillKeys),
            ], $status->sessions),
        );
    }

    private function printGeneration(GenerationReport|null $generation): void
    {
        if ($generation === null) {
            $this->line('No generation yet: run php artisan skill:refresh.');

            return;
        }

        $error = $generation->error === null ? '' : ": {$generation->error}";
        $this->line("Generation {$generation->generationId} is {$generation->status->value}{$error}");
        $this->line("Catalogue digest: {$generation->catalogueDigest}");
    }
}
