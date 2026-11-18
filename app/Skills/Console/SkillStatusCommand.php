<?php

declare(strict_types=1);

namespace App\Skills\Console;

use App\Skills\Exceptions\SkillPreviewRefused;
use App\Skills\Exceptions\SkillSessionHidden;
use App\Skills\Readers\SkillStatusReader;
use App\Skills\Support\SkillAuthoring;
use App\Skills\Values\GenerationStatus;
use App\Skills\Values\PublicationStatus;
use App\Skills\Values\SkillStatus;
use Illuminate\Console\Command;
use Illuminate\Contracts\Container\Container;

/**
 * Shows the journal's owner where skill delivery stands: the newest generation and each session's newest publication,
 * with the reason and the retry command of a failed one.
 */
final class SkillStatusCommand extends Command
{
    protected $signature = 'skill:status
        {--session= : Only this session}
        {--json : Print the status as JSON}';

    protected $description = 'Show the skill generation and each session\'s publication';

    public function handle(SkillAuthoring $authoring, Container $container): int
    {
        try {
            $authoring->actAsOwner();
        } catch (SkillPreviewRefused $refusal) {
            $this->error($refusal->getMessage());

            return self::FAILURE;
        }

        $reader = $container->make(SkillStatusReader::class);
        $session = $this->option('session');

        try {
            $status = is_string($session) ? $reader->statusOfSession($session) : $reader->status();
        } catch (SkillSessionHidden $hidden) {
            $this->error($hidden->getMessage());

            return self::FAILURE;
        }

        if ($this->option('json')) {
            $this->line(json_encode($status->toArray(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return self::SUCCESS;
        }

        $this->printStatus($status);

        return self::SUCCESS;
    }

    private function printStatus(SkillStatus $status): void
    {
        $this->printGeneration($status->generation);

        if ($status->publications === []) {
            $this->line('No session has a publication.');

            return;
        }

        $this->table(
            ['Session', 'Publication', 'State', 'Generation', 'Selection', 'Target', 'Error'],
            array_map(fn (PublicationStatus $publication) => $this->row($publication), $status->publications),
        );

        foreach ($status->publications as $publication) {
            if ($publication->isRetryable()) {
                $this->line("Once its cause is fixed, retry {$publication->publicationId}: {$publication->retryCommand()}");
            }
        }
    }

    private function printGeneration(GenerationStatus|null $generation): void
    {
        if ($generation === null) {
            $this->line('No generation yet: run php artisan skill:refresh.');

            return;
        }

        $error = $generation->error === null ? '' : ": {$generation->error}";
        $this->line("Generation {$generation->generationId} is {$generation->state->value}{$error}");
        $this->line("Catalogue digest: {$generation->catalogueDigest}");
    }

    /**
     * @return list<string>
     */
    private function row(PublicationStatus $publication): array
    {
        return [
            $publication->sessionId,
            $publication->publicationId,
            $publication->state->value,
            $publication->generationId,
            substr($publication->selectionDigest, 0, 12),
            $publication->target,
            $publication->error ?? '',
        ];
    }
}
