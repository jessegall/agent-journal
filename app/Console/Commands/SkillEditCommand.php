<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\ReviseSkill\ReviseSkillCommand;
use App\Console\Concerns\PrintsSkillRefusals;
use App\Console\Concerns\ReadsAudienceOptions;
use App\Contracts\Bus\CommandBus;
use App\Models\Skills\SkillRevision;
use App\Support\SkillAuthoring;
use App\Values\SkillDraft;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * Saves a new revision of a stored skill against the revision you read; what you leave out stays as it was.
 */
final class SkillEditCommand extends Command
{
    use PrintsSkillRefusals;
    use ReadsAudienceOptions;

    protected $signature = 'skill:edit {number : The skill number or key} {--expected-revision= : The revision you read} {--name=} {--description=} {--body= : The Markdown body, - to read it from standard input} {--conditions= : The condition as JSON} {--profile=*} {--base=*} {--driver=*} {--provider=*} {--ability=*} {--request-id= : Send again under the id a failed attempt printed}';

    protected $description = 'Save a new revision of a stored skill';

    public function handle(SkillAuthoring $console, CommandBus $commands): int
    {
        $requestId = (string) ($this->option('request-id') ?? Str::ulid());
        $this->line("Request id: {$requestId}");

        return $this->printRefusals(function () use ($console, $commands, $requestId) {
            $console->actAsOwner();
            $skill = $console->stored((string) $this->argument('number'));
            $current = SkillRevision::currentOf($skill)->draft();

            $draft = new SkillDraft(
                (string) ($this->option('name') ?? $current->name),
                (string) ($this->option('description') ?? $current->description),
                $this->option('body') === null ? $current->sections : $console->sectionsOf(
                    $console->bodyOf((string) $this->option('body')),
                ),
                $this->hasAudienceOptions() ? $console->conditionOf(
                    $this->conditionsOption(),
                    $this->audience(),
                ) : $current->condition,
            );

            return $console->savedLines(
                $commands->run(
                    new ReviseSkillCommand($skill->id, (int) $this->option('expected-revision'), $requestId, $draft),
                ),
            );
        });
    }
}
